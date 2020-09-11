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
      redis.call("set", jin, cjson.encode(jinBody)); -- updated "execCount"
      return 'next'
    end
  else  
    -- remove entry, previous jobinstance did not finish running
    -- skip it
    reddis.call("zrem", KEYS[1], jobId);
    return "next:prev job instance not finished, state:"..lastState;
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
  -- place key in 

  local jobId = KEYS[1] -- from the service
  local jobExecSet = KEYS[2]; -- the exec "queue"
  local jobResultSet = KEYS[3]; -- the result "queue"
  local JobResult = false;
  local jin = jobId.."Instance";
  local jinBody = false;
  local lastState = false;
  local lastTs = false;
  local currentTime;
  -- fetch the instance redord
  do 
    local time = redis.call('time');
    currentTime = time[1] + math.trunc(time[2]/1000);
    local jsonstr = redis.call("get", jin);
    if jsonstr ~= false then
      jinBody = cjson.decode(jsonstr);
      local lastIdx = #jinBody.history;
      lastState = jinBody.history[lastIdx].state;
      lastTs = jinBody.history[lastIdx].time;
    end;
    jobResult = cjons.decode(ARGV[1]);
  end;

  -- if th    jinBody doesnt exist abort with an error
  if jinBody == false then
     redis.call("ZREM", jobExecSet, jobId);
     return "error:jobinstance not found";   
  end;
  
  -- job must be in the correct state
  if lastState ~= "executing" then
     redis.call("ZREM", jobExecSet, jobId);
     return "error:jobinstance has state: "..lastState;
  end
  
  -- save the jobresult,and progress state  
  jinBody.execResult = jobResult;
  table.insert(jinBody.history, { state = 'executed', time = currentTime });
  redis.call('set', jin , cjson.encode(jinBody));
  --- remove the entry in jobExec
  redis.call("zrem", jobExecSet, jobId);
  --  add entry in jobResult
  redis.call("zadd", jobResultSet, "CH", currentTime, jobId);
  
  return 'ok:advanced';
end;

function jobProcessResults() 

  --[[
     use JobId and JobResult (as json value)
     get jobid based on time
     get jobinstance
        if jobinstance not exist, then abort with error, cleanout entry in jobResult "queue"
     get last state
     get last time
     get execResult from jinbody
     get onSuccess from jobDescr
     get onError from jobDescr
     if (state === "processingresult") 
         if processresult count > 2 then 
            make top state "executed"
            goto "process as normal"
         else 
            advance time /3 , ++processresult and yield
     end   

     if (state ~= "executed") then -- something wrong
       delete entry in jobResult queue
       yield error
     end
     -- 
     -- is there and execResult ?
     local reply = false
     if (execResult ~= false) then
       local reply = false
       if (onError ~= false and execResult.error) then -- process error
         reply = cjson.encode({ execInfo=onError, errorResult = execResult.error });
       end
       if (onSuccess ~= false) then
         reply = cjson.encode({ execInfo=onSuccess, successResult = execResult.data });
       end 
     end;  
     remove entry in jobResultSet queue
     if reply == false then 
       -- just skip to next without doing nothing
       jinBody.history add "resultprocessed" and  ts
       
       add entry in jobFinalSet queue
       save jinBody
       return "next:delivered jobfinal:"..jobId
     else
       jinBody.history add "processingresult", ts
       save jinBody
       return reply; 
      end
    end;    
     
      

     if onResult ~= false and execResult ~= falset then
        nothing to do here clean out jobResult queue
        move to queue jobDone
        add state entry
        save jobInst
     end

]]--

-- inputs
local jobId = KEYS[1]
local jobResultSet = KEYS[2]; -- queue 
local ts = ARGV[1]

-- lookup keys
local jin = jobId.."Instance";
-- optoions
local execResult = false;
local onSuccess = false;
local onFailere = false;
local lastState = false;
local nextTs = false;
local jinBody = false;
local currentTime;

do --local scoping
  local time = redis.call('time');
  currentTime = time[1] + math.trunc(time[2]/1000);

  local jsonstr = redis.call("get", jin);
  if jsonstr ~= false then
    jinBody = cjson.decode(jsonstr);
   
    local lastIdx = #jinBody.history;
    lastState = jinBody.history[lastIdx].state;
    lastTs = jinBody.history[lastIdx].time;
   
    local delta = jinBody.jobDescr.info.interval or jinBody.jobDescr.info.oneshot;
    nextTs = ts + math.floor(delta/5);
   
    if type(jinBody.jobDescr.onSuccess) == 'table' then
      onSuccess = jinBody.jobDescr.onSuccess;
      onFailure = jinBody.jobDescr.onFailure;
    end;
    execResult = jinBody.execResult;
  end; -- if
end -- do

-- checks
-- 1.no jinbody 
if jinBody == false then
   redis.call("zrem", jobResultSet, jobId);
   return "error:jobinstance not found, "..jobId;
end

--2. is the state "processingresult"
if lastState == "processingresult" then
  jinBody.processingresult = (jinBody.processingresult or 0) + 1;
  if jinBody.processingresult > 2 then -- existing post processig crashed? so retry
     table.insert(jinBody.history, { state = "executed", time = ts });
     lastState = "executed";
     lastTs = currentTime;
  else
     -- reschedule in future
     redis.call("zadd", jobResultSet, "CH", currentTime, jobId );
     redis.call("set", jin, cjson.encode(jinBody));
     return "next:existing execution found";
  end;
end;     

if (lastState ~="executed") then --wrong state abort
  redis.call("zrem", jobResultSet, jobId);
  return "error:jobInstance in wrong state, "..lastState;
end  


local handler = false;
if (onSuccess ~= false and execResult ~= nil and execResult.error == nil) then
  handler = onSuccess;
elseif (onFailure ~= false and execResult ~= nil and execResult.error ~= nil) then
  handler = onFailure;
elseif onSuccess ~= nil then
  handler = onSuccess;
end;    

-- 1. did previous step NOT select a handler?, skip
if (handler == false) then
  redis.call("zrem", jobResultSet, jobId);
  table.insert(jinBody.histroy, { state = "resultprocessed", time = currentTime });
  redis.call("zadd", jobFinalSet, "CH", currentTime, JobId);
  redis.call("set", cjson.encode(jinBody));
  return 'next:skipped to final, '..jinId;
end

--2. handler exist optionally pass a payload
 
redis.call("zadd", jobResultSet, "CH", nextTs, JobId);
table.insert(jinBody.histroy, { state = "resultprocessing", time = currentTime });
redis.call("set", cjson.encode(jinBody));
return cjson.encode({ response = execResult, handler=handler });
end -- function

