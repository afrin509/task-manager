// const doWorkCallback = (callback) => {
//   setTimeout(() => {
//    return callback;
//   }, 3000);
// };
// run = (err, result) => {
//   if (err) return console.log("err", err);
//   return result;
// };
// doWorkCallback(run("This is undefined", undefined));
const doWorkCallback = (callback) => {
  setTimeout(() => {
    callback('this is undefined',undefined);
    callback(undefined,[1,2,3]);
    // we can also call so many callback functions and all of those callbacks will work line by line
  }, 3000);
};
run = (err, result) => {
  if (err) return console.log("err", err);
  return result;
};
doWorkCallback((err,result)=>{
    if(err) return console.log(err)
    console.log(result)
});
