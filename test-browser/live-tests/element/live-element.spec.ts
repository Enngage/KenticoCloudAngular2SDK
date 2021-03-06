import { flatMap, map } from 'rxjs/operators';

import { ElementResponses } from '../../../lib';
import { Context, setup } from '../../setup';

describe('Live element', () => {

  const context = new Context();
  setup(context);

  const typeCodename: string = 'movie';

  const textElementCodename: string = 'title';
  const multipleChoiceElementCodename: string = 'category';
  const taxonomyElementCodename: string = 'releasecategory';

  let textElementResponse: ElementResponses.ViewContentTypeElementResponse;
  let multipleChoiceElementResponse: ElementResponses.ViewContentTypeElementResponse;
  let taxonomyElementResponse: ElementResponses.ViewContentTypeElementResponse;

  beforeAll((done) => {
    context.deliveryClient.element(typeCodename, textElementCodename)
      .toObservable()
      .pipe(map(r => textElementResponse = r as ElementResponses.ViewContentTypeElementResponse),
        flatMap(() => context.deliveryClient.element(typeCodename, multipleChoiceElementCodename).toObservable())
        , map(r => multipleChoiceElementResponse = r as ElementResponses.ViewContentTypeElementResponse),
        flatMap(() => context.deliveryClient.element(typeCodename, taxonomyElementCodename).toObservable()),
        map(r => taxonomyElementResponse = r as ElementResponses.ViewContentTypeElementResponse)
      )
      .subscribe(() => {
        done();
      });
  });

  it(`element responses should be defined`, () => {
    expect(textElementResponse).toBeDefined();
    expect(multipleChoiceElementResponse).toBeDefined();
    expect(taxonomyElementResponse).toBeDefined();
  });

  it(`element inside responses should be defined`, () => {
    expect(textElementResponse.element).toBeDefined();
    expect(multipleChoiceElementResponse.element).toBeDefined();
    expect(taxonomyElementResponse.element).toBeDefined();
  });

  it(`element taxonomy element should contain valid taxonomy group property`, () => {
    expect(taxonomyElementResponse.element.taxonomyGroup).toBeDefined();
    expect(taxonomyElementResponse.element.taxonomyGroup).toEqual(jasmine.any(String));
  });

  it(`multiple choice element should contain options`, () => {
    expect(multipleChoiceElementResponse.element.options).toBeDefined();
    expect(multipleChoiceElementResponse.element.options.length).toBeGreaterThan(0);
  });

  it(`element element should have all required properties defined`, () => {
    expect(textElementResponse.element.codename).toBeDefined();
    expect(textElementResponse.element.name).toBeDefined();
    expect(textElementResponse.element.type).toBeDefined();
  });

});

