// const doWorkPromise= new Promise((resolve,reject)=>{
//     setTimeout(() => {
//         reject('this promise got rejected')
//                 // resolve([1,2,5])

//                 // reject('new err')
//       }, 2000);

// })
// doWorkPromise.then((result)=>{
//   console.log('Success',result)
// }).catch((err)=>{
//     console.log('Error',err)
// })
// then function runs only when promise goes well that means it get the thing that is present inside resolve function
//catch fun will runs only when promise gets rejected 
// once reject is called then down to that line if you write resolve then also it wont work ik baar reject call hogaya tho hogaya fir vo resolve block mein nahi jayega
// first line either reject or resolve bas vo kaam karega and uske baad kuch bhi kaam nahi kreneg

const add =(a,b)=>{
 return new Promise((resolve,reject)=>{
  setTimeout(()=>{
    resolve(a+b);
  },2000)
 })
}
// add(1,2).then((res)=>{
//   console.log(res);
//   // conventional way of putting promises
//   add(res,5).then((sum2)=>{
//     console.log(sum2)
//   }).catch((e)=>{
//     console.log(e);
//   })
// }).catch((err)=>{
//   console.log(err);
// })
//promise chaining:::this is not nesting -> the only improvement is syntax
add(1,2).then((sum)=>{
  console.log(sum);
  return add(sum,6)
}).then

