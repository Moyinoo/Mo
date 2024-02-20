import fs from 'fs'
import util from 'util'
import path from 'path'

const fileLog = fs.createWriteStream(
  path.join(__dirname + '../../server.log'),
  { flags: 'a' },
)
const ErrorLog = fs.createWriteStream(
  path.join(__dirname + '../../error.log'),
  { flags: 'a' },
)
const logFileName = `Logs_${new Date().toISOString().slice(0, 10)}.log`
const logOutput = process.stdout

const getCurrentTime = () => {
  const now = new Date()
  const ampm = now.getHours() >= 12 ? 'PM' : 'AM'
  const hours = now.getHours() % 12 || 12 // Convert to 12-hour format
  return `${hours}:${now.getMinutes()}:${now.getSeconds()} ${ampm}`
}
// the flag 'a' will update the stream log at every launch
console.log = (msg, ser, meth) => {
  const timestamp = getCurrentTime()
  const service = ser || 'Unknown service'
  const method = meth || 'Unknown method'
  const msgMessage = msg || 'Unknown error'
  const logMessage = `*****************************************************
    Ouput in Logfile:
    File name: ${logFileName}
    ${timestamp} | Error | Service: ${service} | Method: ${method}
    *****************************************************
    ${msgMessage}\n`
  // fileLog.write(util.format(logMessage) + '\n');
  logOutput.write(util.format(msg) + '\n')
}

console.error = (error, url, ser, meth) => {
  const timestamp = getCurrentTime()
  const service = ser || 'Unknown service'
  const method = meth || 'Unknown method'
  const path = url || 'Unknown url'
  const errorMessage = error || 'Unknown error'
  const logMessage = `*****************************************************
    Ouput in Logfile:
    File name: ${logFileName}
    ${timestamp} | Error | Path: ${path} | Service: ${service} | Method: ${method}
    *****************************************************
    ${errorMessage}\n`
  ErrorLog.write(util.format(logMessage) + '\n')
  logOutput.write(util.format(error) + '\n')
}

export default console
