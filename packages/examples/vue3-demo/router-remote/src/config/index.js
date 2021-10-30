export default {
  users: {
    Admin: {
      username: "Admin",
      password: "123456",
      permissions: "1",
      token: "e2b490f6-106f-455f-b0ac-afb6c52d3aeb"
    }, Customer: {
      username: "Customer",
      password: "666666",
      permissions: "2",
      token: "674fc935-c283-42e4-9b7e-f2001ec3b862"
    }
  },
  beta: {
    baseUrl: '//backend-api-02.newbee.ltd/manage-api/v1' // 测试接口域名
  },
  release: {
    baseUrl: '//backend-api-02.newbee.ltd/manage-api/v1' // 正式接口域名
  }
}
