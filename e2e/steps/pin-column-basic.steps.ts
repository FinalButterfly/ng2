import { When } from 'cucumber';
import { element, by, browser } from 'protractor';

When('I scroll table with pinned columns to far bottom', async () => scrollBottom());
When('I scroll table with pinned columns to far right', async () => scrollRight());

async function scrollBottom() {
	await browser.sleep(1000);
	const rows = element.all(by.tagName(`tbody`))
		.get(1)
		.all(by.css(`tr[q-grid-core-source=body]`));
	const el4MouseHover = rows.get(await rows.count() - 1);

	await browser.actions().mouseMove(el4MouseHover).perform();
}

async function scrollRight() {
	await browser.sleep(1000);
	const rows = element.all(by.tagName(`tbody`))
		.get(1)
		.all(by.css(`tr[q-grid-core-source=body]`));
	const cells = rows.get(0)
		.all(by.css(`td`));
	const el4MouseHover = cells.get(await cells.count() - 1);

	await browser.actions().mouseMove(el4MouseHover).perform();
}
