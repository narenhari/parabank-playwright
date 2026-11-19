class RegisterPage {
  constructor(page) {
    this.page = page;
    // ParaBank ids contain dots, so we use attribute selectors
    this.field = (id) => page.locator(`[id="${id}"]`);
    this.registerButton = page.getByRole('button', { name: 'Register' });
    this.successMessage = page.getByText('Your account was created successfully');
  }

  async goto() {
    await this.page.goto('register.htm');
  }

  async register(user) {
    await this.field('customer.firstName').fill(user.firstName);
    await this.field('customer.lastName').fill(user.lastName);
    await this.field('customer.address.street').fill(user.address);
    await this.field('customer.address.city').fill(user.city);
    await this.field('customer.address.state').fill(user.state);
    await this.field('customer.address.zipCode').fill(user.zipCode);
    await this.field('customer.phoneNumber').fill(user.phone);
    await this.field('customer.ssn').fill(user.ssn);
    await this.field('customer.username').fill(user.username);
    await this.field('customer.password').fill(user.password);
    await this.field('repeatedPassword').fill(user.password);
    await this.registerButton.click();
  }
}

module.exports = { RegisterPage };