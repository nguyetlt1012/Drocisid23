NodeJs: 16.15.1
NPM: 8.11.0
MongoDB: 6.0.1
Docker: 20.10.11

1. Convention Code
- tên file, tên hàm, tên biến: Camel case vd: serverRouter, getAllUser, newServer
- tên model: Pascal case vd: UserChannelRole
- tên hằng số: viết hoa cách nhau bằng gạch dưới vd: MANAGE_CHANNEL
- tabWith: 2


2. Update Response object
========
Controller:
{
    apiStatus: 1,
    message: "Success",
    data: {
        name: "Ngoc Pham",
    }
}

{
    apiStatus: 2,
    message: "Other Error",
    data: {}
}
========
Service:
{
    status: "OK",
    data: {}
}

{
    status: "ERROR",
    data: {}
}

