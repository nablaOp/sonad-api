import fs from 'fs';
import path from 'path';

import LoggerInterface from '../lib/application/ports/logger.interface';
import ExternalDictionary from '../lib/application/ports/external-dictionary.interface';
import { IDictionaryEntry } from '../lib/domain/dictionary-entry';

import ConsoleLogger from '../lib/infrastructure/logger/consoleLogger/console-logger';
import DictionaryFactory from '../lib/infrastructure/dictionary/index';
import WordFormsFinder from '../lib/infrastructure/dictionary/sonaveeb/word-forms';
import SonaVeebClient from '../lib/infrastructure/dictionary/sonaveeb/api-client';
import DictonarySonaveeb from '../lib/infrastructure/dictionary/sonaveeb/dictonary-sonaveeb';

const wordHtmlPath = "./kodu.html";
const wordDetailsHtmlPath = "./kodu_details.html";

describe('Dictionary Sonaveeb', () => {
    let dictionary: ExternalDictionary;
    let mockClient: SonaVeebClient;
    let mockWordFormsFinder: WordFormsFinder;
    let logger: LoggerInterface;

    beforeAll(() => {
        logger = new ConsoleLogger();

        mockClient = new SonaVeebClient(logger) as jest.Mocked<SonaVeebClient>;
        jest.spyOn(mockClient, 'getResultPage').mockImplementation(() => {
            return Promise.resolve(fs.readFileSync(path.join(__dirname, wordHtmlPath), 'utf8'));
        });
        jest.spyOn(mockClient, 'getWordDetailsHtml').mockImplementation(() => {
            return Promise.resolve(fs.readFileSync(path.join(__dirname, wordDetailsHtmlPath), 'utf8'));
        });

        mockWordFormsFinder = new WordFormsFinder(DictionaryFactory.getStrategies());
        dictionary = new DictonarySonaveeb(logger, mockWordFormsFinder, mockClient);
    });

    describe('getWord', () => {
        it('should return dictionary entry', async () => {
            const result = await dictionary.getWord('kodu');
            const payload = result.payload as IDictionaryEntry;

            expect(payload.word).toEqual('kodu');
            expect(payload.wordForms).toEqual({
                singular: {
                    nimetav: 'kodu',
                    omastav: 'kodu',
                    osastav: 'kodu',
                },
                plural: {
                    nimetav: 'kodud',
                    omastav: 'kodude',
                    osastav: 'kodusid',
                },
            });
        });
    });
});