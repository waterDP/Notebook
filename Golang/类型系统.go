/*
 * @Author: water.li
 * @Date: 2022-06-04 21:48:03
 * @LastEditors: water.li
 * @LastEditTime: 2022-06-05 21:50:59
 * @FilePath: \note\Golang\类型系统.go
 */
package main

import (
	"fmt"
	"time"
)

type helloworld struct {
	value string
}

type showhello interface {
	print()
}

func (hw helloworld) print() {
	fmt.Println(hw.value)
}

func main() {
	//  直接常量
	fmt.Println("Hello World")
	// 2. 格式化常量
	fmt.Printf("%s\n", "Hello World")
	// 3.直接变量
	var str string = "hello world!"
	fmt.Printf("%s\n", str)

	// 4.数字转义
	fmt.Printf("%c%c", 104, 108)

	// 5.切片实现
	var slice []string = make([]string, 0)
	slice = append(slice, "hello")
	slice = append(slice, " ")
	slice = append(slice, "world")
	slice = append(slice, "!")
	var str2 string
	for i := 0; i < len(slice); i++ {
		str2 += slice[i]
	}
	fmt.Println(str2)

	// 6.map实现
	var m1 map[int]string = make(map[int]string, 4)
	m1[1] = "hello "
	m1[2] = "world!"
	fmt.Printf("%s%s\n", m1[1], m1[2])

	// 7.结构体实现
	var hw helloworld
	hw.value = "hello world!"
	fmt.Println(hw.value)

	// 8. 接口实现
	var sh showhello = hw
	sh.print()

	// 9. 闭包实现
	ClosurePrint()

	// 10. channel实现
	var ch chan string = make(chan string, 8)
	go chanPrint(ch)
	ch <- "hello"
	ch <- " "
	ch <- "world"
	ch <- "!"
	time.Sleep(time.Second * 5) // 等特5秒钟
}

// 闭包实现
func ClosurePrint() {
	var str string = "hello word"
	f := func() {
		fmt.Println(str)
	}
	f()
}

func chanPrint(ch chan string) {
	for v := range ch {
		fmt.Print(v)
	}
}
