<h2>拓展操作符</h2>
扩展运算符以三个点的形式出现 ... 可以将数组或者对象里面的值展开。
<pre>
const a = [1, 2, 3]

console.log(a) // 1 2 3

const b = {a: 1, b: 2}

console.log({c: 3, ...b}) // {a: 1, b: 2, c: 3}
</pre>
<h2>剩余操作符</h2>
另外一种以三个点 ... 形式出现的是剩余操作符，与扩展操作符相反，剩余操作符将多个值收集为一个变量，而扩展操作符是将一个数组扩展成多个值。
<pre>
// 配合 ES6 解构的新特性
const [a, ...b] = [1, 2, 3]

console.log(a) // 1
console.log(b) // [2, 3]
</pre>
最后再看一个例子，在日常开发当中非常常见，而且同时利用到扩展操作符和剩余操作符，在 React 开发当中常常会利用一些组件库，为了业务需要我们会将一些组件库提供的组件封装成业务组件方便开发。
<pre>
import { Button } from 'antd'  // 组件库提供的组件

function MyButton({ isDanger, children, ...others }) {
  return (
    <div>
      {isDanger ?
        <Button {...others} size="large" type="danger">{children}</Button> :
        <Button {...others} size="small" type="primary">{children}</Button>
      }
    </div>
  )
}
</pre>