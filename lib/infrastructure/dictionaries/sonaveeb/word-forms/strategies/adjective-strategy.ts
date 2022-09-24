import { ElementHandle, Page } from 'puppeteer';
import { WordFormStrategy } from '@lib/infrastructure/dictionaries/sonaveeb/word-forms';

export default class AdjectiveStrategy implements WordFormStrategy {
	async getWordForms(page: Page, tableHandle: ElementHandle, partOfSpeech: string): Promise<object | void> {
		if (partOfSpeech !== 'omadussõna') {
			return;
		}

		return page.evaluate(this.evaluateAdjectiveTable, tableHandle);
	}

	private evaluateAdjectiveTable(table: Element) {
		const tableCellElements = table.querySelectorAll('td');

		const tableCellValues = [...tableCellElements]
			.map((tableCell: Element) => tableCell?.textContent?.replace(/\s/g, '') ?? '')
			.filter((value) => value);

		return {
			ainsuse: {
				nimetav: tableCellValues[0],
				omastav: tableCellValues[2],
				osastav: tableCellValues[4],
			},
			mitmuse: {
				nimetav: tableCellValues[1],
				omastav: tableCellValues[3],
				osastav: tableCellValues[5],
			},
		};
	}
}
