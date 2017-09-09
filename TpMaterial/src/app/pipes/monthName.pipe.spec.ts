import { MonthNamePipe } from './monthname.pipe';

describe('MonthNamePipe', () => {
  it('create an instance', () => {
    const pipe = new MonthNamePipe();
    expect(pipe).toBeTruthy();
  });
});
