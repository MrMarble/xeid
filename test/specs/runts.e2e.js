describe("RunTS", () => {
  it("Logo should be visible", async () => {
    const header = await $("main header img");
    await expect(header).toExist();
    await expect(header).toBeDisplayed();
  });
});
