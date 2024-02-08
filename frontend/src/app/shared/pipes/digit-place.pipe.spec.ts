import { DigitPlacePipe } from './digit-place.pipe';

describe('DigitPlacePipe', (): void => {
  const digitPlacePipe: DigitPlacePipe = new DigitPlacePipe();

  it ("should return  '1 000 000'", (): void => {
    expect(digitPlacePipe.transform(1000000)).toBe('1 000 000');
  });
  it ("should return  '100 000'", (): void => {
    expect(digitPlacePipe.transform(100000)).toBe('100 000');
  });
  it ("should return  '10 000'", (): void => {
    expect(digitPlacePipe.transform(10000)).toBe('10 000');
  });
  it ("should return  '1 000'", (): void => {
    expect(digitPlacePipe.transform(1000)).toBe('1 000');
  });
  it("should return '100'", ():void => {
    expect(digitPlacePipe.transform(100)).toBe('100');
  });
  it("should return '10'", (): void => {
    expect(digitPlacePipe.transform(10)).toBe('10');
  });
  it("should return '2'", (): void => {
    expect(digitPlacePipe.transform(2)).toBe('2');
  });
});
