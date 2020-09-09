-- eval 'local jobschedules = redis.call("zrangebyscore",KEYS[1], "-inf", ARGV[1], "WITHSCORES", "LIMIT", 0, 1); if #jobschedules == 0 then  return "no jobs available" end; local jobId = jobschedules[1]; local ts = jobschedules[2]; local jobdescr = redis.call("get",jobId); if (type(jobdescr) ~= 'string') then redis.call("zrem", KEYS[1], jobId ); return "jobdescrnotfound job "..jobId.." removed" end; local json = cjson.decode(jobdescr); local nextTs = json.info.interval + ts ; local sched = redis.call("zadd", KEYS[1], "CH", nextTs, jobId); local submit = redis.call("zadd", KEYS[2],"CH", nextTs, jobId); return sched, submit;' 2 "sjobregistry" "sjobExec"  "+inf" 45

local jobschedules = redis.call("zrangebyscore",KEYS[1], "-inf", ARGV[1], "WITHSCORES", "LIMIT", 0, 1);
if #jobschedules == 0 then 
    return "no jobs available" 
end; 

local jobId = jobschedules[1]; 
local ts = jobschedules[2]; 
local jobdescr = redis.call("get",jobId); 
if (type(jobdescr) ~= 'string') then 
    redis.call("zrem", KEYS[1], jobId ); 
    return "jobdescrnotfound job "..jobId.." removed" 
end; 

local json = cjson.decode(jobdescr); 

if (json.info.interval) then
  local nextTs = json.info.interval + ts ; 
  local sched = redis.call("zadd", KEYS[1], "CH", nextTs, jobId); 
  local submit = redis.call("zadd", KEYS[2],"CH", nextTs, jobId); 
  return sched, submit;
end

if (json.info.onshot) then
   local submit = redis.call("zadd", KEYS[2],"CH", nextTs, jobId); 
   local remov = redis.call("zrem", KEYS[1], jobId );
   -- redis.call("del", jobId);
   return remov, submit;
end    

return "no [interval] or [oneshot] property found in json";

-- execution in 2 parts

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
   
    


-- update job sta






--' 2 "sjobregistry" "sjobExec"  "+inf" 45

local candidate = redis.call("zrangebyscore", KEYS[1], "-inf", ARGV[1], "")