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

