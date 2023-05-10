const users = [{email: "lovisa.thorsander@gmail.com", firstName: "Lovisa", lastName: "Thorsander", password: "eventures"}];

function createUser(firstName, lastName, email, password, rePassword) {
  const user = { firstName, lastName, email, password, rePassword };
  console.log(users)
  users.push(user);
}

export { users, createUser };