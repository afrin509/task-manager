const math = require("../src/math");
// 1.name for testcase,2.funcion
test("hello world", () => {});
//if it gives error that means that test testcase has failed
// test("this should fail", () => {
//   throw new Error("failure");
// });
// test("should caluclate correct tip", () => {
//   const total = math.caluclateTip(10, 0.3);
//   //   if (total != 13) {
//   //     return new Error("total tip should be 13.Got " + total);
//   //   }
//   expect(total).toBeNull();
//   // this is method provided in the package which takes the variabl and value you ar expecting
// });
test("Should convert 32 F to 0 C", () => {
  expect(math.fahrenheitToCelsius(32)).toBe(0);
});

test("Should convert 0 C to 32 F", () => {
  expect(math.celsiusToFahrenheit(0)).toBe(32);
});
// test("Async testing",()=>{
//     const p=1;
//     setTimeout(()=>{
//       p=2;
//     },1000);
//     expect(p).toBe(2);
// })
// the above  async code is not run by jest so before waiting 1sec it is declared that test false that means it is not unning this async code
// test("Async testing",(done)=>{
//     const p=1;
//     done()
//     setTimeout(()=>{
//       expect(1).toBe(2);
//   console.log("i am late afrin")

//     },1000);
// })
// the above example say that done ko run karo uske baad hein decide karna
// the above funciton did not wai till 1 sec it did not print console
test("Async testing", (done) => {
  setTimeout(() => {
    expect(2).toBe(2);
    console.log("i am late afrin");
    done();
  }, 2000);
});
const add = (a, b) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (a < 0 || b < 0) {
                return reject('Numbers must be non-negative')
            }

            resolve(a + b)
        }, 2000)
    })
}
test('should add two numbers',(done)=>{
  add(2,3).then((sum)=>{
    expect(sum).toBe(5);
    done();
  })
})
// remember to use any of the methods dont use both methods at thesame time data(callback) and async/await is used seperately
test('should add two numbers using async/await',async()=>{
 const sum= await add(2,3);
  
    expect(sum).toBe(5);
 
})