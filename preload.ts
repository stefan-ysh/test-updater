import os from "os";
const SYS_NEMU = {
  aix: "UNIX",
  android: "安卓",
  darwin: "mac",
  freebsd: "UNIX",
  haiku: "haiku",
  linux: "linux",
  openbsd: "UNIX",
  sunos: "sunos",
  win32: "windows",
  cygwin: "UNIX",
  netbsd: "UNIX-like",
};

const sys = os.platform(); // 等于 process.platform
console.log('[ 当前用户 ] >', os.userInfo().username)
console.log('[ 当前系统 ] >', SYS_NEMU[sys])
