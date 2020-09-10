-- eval 'local jobschedules = redis.call("zrangebyscore",KEYS[1], "-inf", ARGV[1], "WITHSCORES", "LIMIT", 0, 1); if #jobschedules == 0 then  return "no jobs available" end; local jobId = jobschedules[1]; local ts = jobschedules[2]; local jobdescr = redis.call("get",jobId); if (type(jobdescr) ~= 'string') then redis.call("zrem", KEYS[1], jobId ); return "jobdescrnotfound job "..jobId.." removed" end; local json = cjson.decode(jobdescr); local nextTs = json.info.interval + ts ; local sched = redis.call("zadd", KEYS[1], "CH", nextTs, jobId); local submit = redis.call("zadd", KEYS[2],"CH", nextTs, jobId); return sched, submit;' 2 "sjobregistry" "sjobExec"  "+inf" 45
function JobPicker()

local jobschedules = redis.call("zrangebyscore",KEYS[1], "-inf", ARGV[1], "WITHSCORES", "LIMIT", 0, 1);
if #jobschedules == 0 then 
    return "no jobs available" 
end; 

local jobId = jobschedules[1]; 
local ts = jobschedules[2]; 
local jobdescr = redis.call("get",jobId); 
if type(jobdescr) ~= 'string' then 
    redis.call("zrem", KEYS[1], jobId ); 
    return "jobdescrnotfound job "..jobId.." removed" 
end; 

local json = cjson.decode(jobdescr); 

if type(json.info.interval) == "number" then
  local nextTs = json.info.interval + ts ; 
  local sched = redis.call("zadd", KEYS[1], "CH", nextTs, jobId); 
  local submit = redis.call("zadd", KEYS[2],"CH", nextTs, jobId); 
  return sched, submit;
end

if type(json.info.onshot) == "number" then
   local submit = redis.call("zadd", KEYS[2],"CH", nextTs, jobId); 
   local remov = redis.call("zrem", KEYS[1], jobId );
   -- redis.call("del", jobId);
   return remov, submit;
end    

return "no [interval] or [oneshot] property found in json";

end
--[[ execution in 2 parts

-- part1

-- get the executable jobId (just the latest no ts filtering)
-- get the job
-- create job key representing this job run running.jobId (use setnx)
-- if this record creation fails:
      -- fetch latest state-entry of the job
      -- if the latest state not "executing.." then
           -- update ts to a very large number so we can look at it at a later time
           -- execCount++
           -- return "do nothing"
      -- else
          -- the state was "executing..." (maybe this is taking to long?)
          --  if current time - ts of the "executing state" < intervaltime
               -- return "do nothing, maybe plus an internal warn code" 
          -- else
             -- execution is running behind (for some reason)
             -- go to "successfull  record creation"

-- label: "successfull record creation"
  -- new entry in for this state
  -- update score to ts+intervaltime/3
  -- return "ok to execute"
--]]  
function pickNextForExecution()
local execJobs = redis.call("zrangebyscore",KEYS[1], "-inf", ARGV[1], "WITHSCORES", "LIMIT", 0, 1);

if #execJobs == 0 then 
    return "no jobs available";
end;

local jobId = execJobs[1];
local ts = execJobs[2]

-- fetch the state from redis
local jobdescr = false;
local jin = false;
local jinbody = false;
local lastState = false;
local lastTs = false;
local nextTs = false; -- ts + math.floor(delta/3);
do -- scope 
   local jobdescrRaw = redis.call("get",jobId);
   if jobdescrRaw ~= false then
      jobdescr = cjson.decode(jobdescrRaw);
      local delta = jobdescr.info.interval or jobdescr.info.oneshot;
      nextTs = ts + math.floor(delta/3);
   else
      nextTs = ARGV[1] + 1000;  
   end;  
   --2. job execution instance
   jin = jobId.."Instance"
   local jsonstr = redis.call("get", jin);
   if jsonstr ~= false then
       jinbody = cjson.decode(jsonstr);
       local lastIdx = #jinbody.history;
       lastState = jinbody.history[lastIdx].state;
       lastTs = jinbody.history[lastIdx].time;
   end;
end   
-- some checks
--1. no job description or execution record?
if jobdescr == false and jinbody == false then
  redis.call(zrem, KEYS[1], jobId );
  return "next"; -- same as "yield"
end

--2. no job description, but lingering execution record?
if jobdescr == false and jinbody ~= false then
  -- check if the state is "execution"
 if lastState ~= "executing" then -- in this context job was deleted
    redis.call(zrem, KEYS[1], jobId);
    return "next";
  else
    jinbody.execCount = (jinbody.execCount or 0) + 1;
    -- remove 4 is hardcoded count,
    if jinbody.execCount > 4 then
       redis.call("zrem", KEYS[1], jobId);
       return "next";
    end
    -- reschedule
    sched = redis.call("zadd", KEYS[1], "CH", nextTs, jobId);
    return "next";
end;

--3. we have a job-description and a lingering record
if jobdescr ~= false and jinbody ~= false then
  -- process is stuck in this state?, because process crashed, rpc taking to long?
  if lastState == "executing" then 
    jinbody.execCount = (jinbody.execCount or 0) + 1;
    if jinbody.execCount > 2 then
        -- process crashed, remove the job instance
        redis.call("del", jin);
        jinbody = false;
        -- fall through
    else
      -- reschedule
      redis.call("zadd", KEYS[1], "CH", nextTs, jobId);
      return 'next'
    end
  else  
    -- remove entry, previous jobinstance did not finish running
    -- skip it
    reddis.call("zrem", KEYS[1], jobId);
    return "next";
  end
end 

--4. we have jobdescr and no lingering job instance record (this could be a restart/or the first execution)
-- reschedule

sched = redis.call("zadd", KEYS[1], "CH", nextTs, jobId);
jinbody = { history = {{ state = "executing", time=ARGV[1]}} , jobdescr = jobdescr };

redis.call("set", jin, cjson.encode(jinbody));
return cjson.encode(jobdescr); -- return body for execution;
-- done
end


--' 2 "sjobregistry" "sjobExec"  "+inf" 45

-- local candidate = redis.call("zrangebyscore", KEYS[1], "-inf", ARGV[1], "")

function jobPostExecution() -- use JobId and JobResult (as json value)

  -- find the jobinstance record
    -- if it doesnt exist , exit with error
  -- if it exist, remove the jobinst from the jobexecute sorted setx
  -- make sure the jobinst is in your "state" (execution) otherwise report error, and clean up all (excpet jobinst)
  -- if the executionCount is lower then yours discard result, and report this error , clean out entry in jobexec
  -- if executionCount is higher or equal then yours, set it to your execCount, clean out entry in jobexec add state to history and insert into jobResult sorted set
  -- 



  do -- scope 
    local jobdescrRaw = redis.call("get",jobId);
    if jobdescrRaw ~= false then
       jobdescr = cjson.decode(jobdescrRaw);
       local delta = jobdescr.info.interval or jobdescr.info.oneshot;
       nextTs = ts + math.floor(delta/3);
    else
       nextTs = ARGV[1] + 1000;  
    end;  
    --2. job execution instance
    jin = jobId.."Instance"
    local jsonstr = redis.call("get", jin);
    if jsonstr ~= false then
        jinbody = cjson.decode(jsonstr);
        local lastIdx = #jinbody.history;
        lastState = jinbody.history[lastIdx].state;
        lastTs = jinbody.history[lastIdx].time;
    end;
 end 


end