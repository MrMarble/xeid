describe("RunTS", () => {
  it("Logo should be visible", async () => {
    const header = await $("main header img");
    await expect(header).toExist();
    await expect(header).toBeDisplayed();
  });

  it("Header should be draggable", async () => {
    const header = await $("main header");
    await expect(header).toHaveAttr("data-tauri-drag-region", "true");
  });

  it("Windows controls should be visible", async () => {
    const controls = await $("main div[data-testid='window-controls']");
    await expect(controls).toExist();
    await expect(controls).toBeDisplayed();
  });
});
