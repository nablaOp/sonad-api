import { ElementHandle, Page } from 'puppeteer';
import { WordFormStrategy } from '@lib/infrastructure/dictionaries/sonaveeb/word-forms';

export default class ConjunctionStrategy implements WordFormStrategy {
	async getWordForms(page: Page, tableHandle: ElementHandle, partOfSpeech: string): Promise<object | void> {
		if (partOfSpeech !== 'sidesõna') {
			return;
		}

		return page.evaluate(this.evaluateConjunctionTable, tableHandle);
	}

	private evaluateConjunctionTable(table: Element) {
		const tableCellElements = table.querySelectorAll('td');

		const tableCellValues = [...tableCellElements]
			.map((tableCell: Element) => tableCell?.textContent?.replace(/\s/g, '') ?? '')
			.filter((value) => value);

		return {
			muutumatu: tableCellValues[0],
		};
	}
}
