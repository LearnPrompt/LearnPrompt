---
sidebar_position: 19
---

# 代码助理

你可以使用 ChatGPT 进行代码生成、生成测试用例、注释、审查和漏洞检测。

## 代码生成

我们可以让 ChatGPT 自动生成一个排序算法中的快速排序的Python代码。

<div 
trydyno-embed="" 
openai-model="text-davinci-003" 
initial-prompt="I want you to work as a junior python programmer. Please write a python code for a quick sort algorithm." 
initial-response="" 
max-tokens="512" 
box-rows="5" 
model-temp="0.7" 
top-p="1.0">
    <noscript>Failed to load Dyno Embed: JavaScript must be enabled</noscript>
</div>

简单的代码生成对于 ChatGPT 来说小事一桩。

## 测试用例

用例来源出自[StuGRua](https://juejin.cn/post/7211716002382528573)

在待测函数函数定义清晰的情况下，单元测试可以通过 ChatGPT 来生成。

```text

写下列代码中CompressPicture函数的单测，要求覆盖全部逻辑。
断言使用require包。
测试用例以testCases的形式输出。

// CompressPicture the picture by resizing it to the specified width.
func CompressPicture(picData []byte, width uint) ([]byte, error) {
   // Decode the input image.
   oldBuffer := bytes.NewBuffer(picData)
   inputImg, _, err := image.Decode(oldBuffer)
   if err != nil {
      return nil, err
   }
   // Resize the image to the specified width.
   outputImg := resize.Resize(width, 0, inputImg, resize.Lanczos3)
   // Encode the output image as PNG and write it to a buffer.
   newBuffer := new(bytes.Buffer)
   err = png.Encode(newBuffer, outputImg)
   if err != nil {
      return nil, err
   }
   // Return the compressed image as a byte slice.
   return newBuffer.Bytes(), nil
}

// highlight-start

# ChatGPT生成代码块如下：

func TestCompressPicture(t *testing.T) {
   // Setup test data
   imgData, err := os.ReadFile("test-image.png")
   if err != nil {
      t.Fatalf("failed to read test image file: %v", err)
   }
   testCases := []struct {
      name  string
      width uint
   }{
      {"compress with a valid width", 500},
      {"compress with an invalid width", 0},
   }
   for _, tc := range testCases {
      t.Run(tc.name, func(t *testing.T) {
         // Invoke the function being tested.
         compressedData, err := CompressPicture(imgData, tc.width)

         // Check the result.
         if err != nil {
            t.Fatalf("unexpected error: %v", err)
         }
         if len(compressedData) == 0 {
            t.Fatalf("compressed data is empty")
         }
         create, err := os.Create("test-image-compressed.png")
         if err != nil {
            return
         }
         defer create.Close()
         _, err = create.Write(compressedData)
      })

   }
}

// highlight-end
```

ChatGP T单次对话有长度限制，所以一次尽量只进行一个函数的单元测试生成。

## 代码注释 & 格式优化

ChatGPT 可以通过阅读代码，理解函数的输入、输出、功能以及用途，然后生成相应的 API 文档和注释。

```text
Please add line comments to this Python code and reformat it to make it easier to read:

import openai
openai.api_key = "YOUR_API_KEY"

def generate_response(prompt):
    response = openai.Completion.create(engine="davinci",prompt=prompt,temperature=0.5,max_tokens=1024,n=1,stop=None)
    return response.choices[0].text.strip()

while True:
    prompt = input("请输入你的问题：")
    response = generate_response(prompt)
    print("答案：", response)
```

ChatGPT给每一句话都加上了解释，并且将过长的语句转化成更加易读的格式。

```python
import openai  # Import the openai module

# Set the API key for the openai module
openai.api_key = "YOUR_API_KEY"  # Replace with your actual OpenAI API key

# Define a function for generating a response from OpenAI's language model given a prompt
def generate_response(prompt):
    # Create an OpenAI completion with the specified parameters
    response = openai.Completion.create(
        engine="davinci",  # Use the 'davinci' language model
        prompt=prompt,  # Use the provided prompt
        temperature=0.5,  # Use a temperature of 0.5, which means the model will generate diverse responses
        max_tokens=1024,  # Generate up to 1024 tokens of output
        n=1,  # Generate a single response
        stop=None  # Do not use a stop sequence to end the generated text
    )
    # Extract the generated text from the response and return it
    return response.choices[0].text.strip()

# Continuously prompt the user for questions and generate responses using the generate_response function
while True:
    prompt = input("Please enter your question: ")  # Prompt the user for a question
    response = generate_response(prompt)  # Generate a response to the question using the generate_response function
    print("Answer:", response)  # Print the generated response
```

## 代码调试

通过之前的几个步骤，你已经了解了如何编写正确且具有测试用例的代码。

在日常开发中，除了编写代码之外，我们还会遇到两个比较棘手的开发步骤。一个是解决运行现有的代码后出现的错误；另一个是如何在当前编程语言中复现其他编程语言已经支持的处理逻辑呢？

我们先解决第一个问题。一般来说，写完代码后运行，如果代码中有错误，解释器会提示错误信息，按照提示信息，通常可以很快找出错误并进行修改。但有时候错误提示信息不是那么明确，当你检查了几遍仍然无法找出问题，就会比较困扰。ChatGPT 可以结合已有的错误信息，帮助我们分析代码中潜在的问题。

这里我选择了一个stack overflow上**python跟SQL数据库连接错误**的例子：[Error while trying to connect to sql server with python using pyodbc](https://stackoverflow.com/questions/64209295/error-while-trying-to-connect-to-sql-server-with-python-using-pyodbc)

ChatGPT扮演成了一个python专家：

```text
You are a python expert who can pinpoint errors in your code through error messages and provide easy-to-understand solutions.

error```
Traceback (most recent call last):
File "[test.py](http://test.py/)", line 7, in <module>
conn = pyodbc.connect('DRIVER={ODBC Driver 17 for SQL
Server};SERVER='+server+';DATABASE='+database+';UID='+username+';PWD='+ password)
pyodbc.InterfaceError: ('28000', "[28000] [Microsoft][ODBC Driver 17 for SQL Server][SQL
Server]Login failed for user 'SA'. (18456) (SQLDriverConnect); [28000] [Microsoft][ODBC
Driver 17 for SQL Server][SQL Server]Login failed for user 'SA'. (18456)")

code```

import pyodbc

server = 'SERVER'

database = 'DBNAME'

username = 'SA'

password = 'SQLPWD'

conn = pyodbc.connect('DRIVER={ODBC Driver 17 for SQL Server};SERVER='+server+';DATABASE='+database+';UID='+username+';PWD='+ password)

Please analyse "code" for possible causes, solutions and the correct code depending on the "error”.  

// highlight-start

The error message indicates that the login for the SQL Server failed for the user 'SA'. There could be several reasons for this error, but one possible reason is that the provided password is incorrect or the 'SA' account is disabled. Here are some steps to troubleshoot and fix the error:

Verify the username and password: Double-check that the provided username and password are correct. You can try logging in to the SQL Server using these credentials to ensure that they are valid.

Check if the 'SA' account is disabled: If the 'SA' account is disabled, you will not be able to log in to the SQL Server using this account. You can check the account status in SQL Server Management Studio or by running a query on the server:

// highlight-end
```

```python
SELECT name, is_disabled
FROM sys.sql_logins
WHERE name = 'SA'
```

```text
// highlight-start
If the 'is_disabled' column value is 1, then the account is disabled. To enable the account, you can run the following query:
// highlight-end
```

```python
ALTER LOGIN SA WITH PASSWORD = '<new_password>', CHECK_POLICY = OFF, CHECK_EXPIRATION = OFF;
```

```text
// highlight-start

Note that it's not recommended to use the 'SA' account for regular database operations as it has elevated privileges.

Check the SQL Server authentication mode: If the SQL Server authentication mode is set to 'Windows Authentication mode only', you will not be able to log in using SQL Server authentication. You can check the authentication mode in SQL Server Management Studio by right-clicking on the server instance, selecting Properties, and navigating to the Security tab.

// highlight-end
```

ChatGPT 给出的解决方法是：

- 验证用户名和密码
- 检查 "SA "账户是否被禁用
- 检查SQL Server的认证模式

而网页中最受欢迎的回复是：

- SA被禁止访问
- 服务器认证选择错误
- SQL服务器没有开放远程访问

通过比较，我们很容易得到ChatGPT在代码调试方面的可行性。

## 代码互翻

ChatGPT 提供的另一个非常有用的功能是能够将程序从一种语言移植到另一种语言。

这里我在 Leetcode 找了一道常见算法题[**最长回文子串**](https://leetcode.cn/problems/longest-palindromic-substring/)的 C++ 实现，转化成 Python 语言。

:::note
最长回文子串题目：

给你一个字符串 s，找到 s 中最长的回文子串。
如果字符串的反序与原始字符串相同，则该字符串称为回文字符串。
:::

```text
You are an expert program developer with extensive experience in writing C++ and Python. Please convert this C++ program to Python:

code```
class Solution {
public:
    string longestPalindrome(string s) {
        int len=s.size();
        if(len==0||len==1)
            return s;
        int start=0;
        int max=1;
        vector<vector<int>>  dp(len,vector<int>(len));
        for(int i=0;i<len;i++)
        {
            dp[i][i]=1;
            if(i<len-1&&s[i]==s[i+1])
            {
                dp[i][i+1]=1;
                max=2;
                start=i;
            }
        }
        for(int l=3;l<=len;l++)
        {
            for(int i=0;i+l-1<len;i++)
            {
                int j=l+i-1;
                if(s[i]==s[j]&&dp[i+1][j-1]==1)
                {
                    dp[i][j]=1;
                    start=i;
                    max=l;
                }
            }
        }
        return s.substr(start,max);
    }
};
```

ChatGPT输出的代码部份如下：

```python
class Solution:
    def longestPalindrome(self, s: str) -> str:
        n = len(s)
        if n == 0 or n == 1:
            return s
        start = 0
        max_len = 1
        dp = [[0] * n for _ in range(n)]
        for i in range(n):
            dp[i][i] = 1
            if i < n - 1 and s[i] == s[i+1]:
                dp[i][i+1] = 1
                start = i
                max_len = 2
        for l in range(3, n+1):
            for i in range(n-l+1):
                j = i + l - 1
                if s[i] == s[j] and dp[i+1][j-1] == 1:
                    dp[i][j] = 1
                    start = i
                    max_len = l
        return s[start:start+max_len]
```

代码顺利通过测试：

![code](./img/code_res.png)

##  IDE 推荐

这里我推荐的是[Cursor.so](https://www.cursor.so/)，它本身是一个集成了 GPT-4, 国内直接可以访问的，优秀而强大的免费代码生成器，可以帮助你快速编写、编辑和讨论代码。它支持多种编程语言，如 Python, Java, C#, JavaScript 等，并且可以根据你的输入和需求自动生成代码片段。