import { FieldModels, ItemResponses, RichTextImage, ImageUrlBuilder } from '../../../lib';
import { Actor, Context, Movie, setup } from '../../setup';

describe('Live item', () => {

  const context = new Context();
  setup(context);

  const movieCodename: string = 'warrior';
  let response: ItemResponses.DeliveryItemResponse<Movie>;

  beforeAll((done) => {
    context.deliveryClient.item<Movie>(movieCodename)
      .queryConfig({
        richTextImageResolver: (image, fieldName) => {

          const newImageUrl = new ImageUrlBuilder(image.url)
            .withCustomParam('xParam', 'xValue')
            .getUrl();

          return {
            url: newImageUrl
          };
        },
      })
      .getObservable()
      .subscribe(r => {
        response = r as ItemResponses.DeliveryItemResponse<Movie>;
        done();
      });
  });

  it(`item response should be defined`, () => {
    expect(response).toBeDefined();
  });

  it(`item should be defined`, () => {
    expect(response.item).toBeDefined();
  });

  it(`item should be instance of 'Movie' class`, () => {
    expect(response.item).toEqual(jasmine.any(Movie));
  });

  it(`item should be instance of 'Movie' class`, () => {
    expect(response.item).toEqual(jasmine.any(Movie));
  });

  it(`title should be 'Warrior'`, () => {
    expect(response.item.title.text).toEqual('Warrior');
  });

  it(`verify 'plot' rich text field with linked items contains expected html`, () => {
    const html = response.item.plot.getHtml();
    expect(html).toContain('<p>Tom</p>');
  });

  it(`released date should be '2011-09-09T00:00:00Z'`, () => {
    expect(response.item.released.datetime).toEqual(new Date('2011-09-09T00:00:00Z'));
  });

  it(`poster asset should be defined`, () => {
    expect(response.item.poster).toBeDefined();
  });

  it(`poster asset' url should be set`, () => {
    const assetUrl = response.item.poster.assets[0].url;
    expect(assetUrl).toBeDefined();
    expect(assetUrl).toContain('https://');
  });

  it(`category options should be defined`, () => {
    expect(response.item.category.options).toBeDefined();
  });

  it(`there should be 2 category options defined`, () => {
    expect(response.item.category.options.length).toEqual(2);
  });

  it(`checks codename of first category option`, () => {
    expect(response.item.category.options[0].codename).toEqual('action');
  });

  it(`checks codename of second category option`, () => {
    expect(response.item.category.options[1].codename).toEqual('drama');
  });

  it(`checks that category options are of proper type`, () => {
    expect(response.item.category.options[1]).toEqual(jasmine.any(FieldModels.MultipleChoiceOption));
  });

  it(`stars linked items should be defined`, () => {
    expect(response.item.stars).toBeDefined();
  });

  it(`check number of stars items`, () => {
    expect(response.item.stars.length).toEqual(2);
  });

  it(`checks that linkedItemCodenames field is mapped and container proper data`, () => {
    expect(response.item.plot.linkedItemCodenames).toBeDefined();
    expect(response.item.plot.linkedItemCodenames.length).toEqual(2);
    expect(response.item.plot.linkedItemCodenames).toContain('tom_hardy');
    expect(response.item.plot.linkedItemCodenames).toContain('joel_edgerton');
  });

  it(`check that type of stars property is correct`, () => {
    expect(response.item.stars[0]).toEqual(jasmine.any(Actor));
  });

  it(`Check that linked item (Actor) has 'firstName' text properly assigned`, () => {
    expect(response.item.stars[0].firstName.text).toEqual('Tom');
  });

  it(`url slug field should be defined`, () => {
    expect(response.item.seoname).toBeDefined();
  });

  it(`url of url slug field should be resolved`, () => {
    expect(response.item.seoname.getUrl()).toEqual('testSlugUrl/warrior');
  });

  it(`checks that html contains resolved linked item content #1`, () => {
    const expectedHtml = `<p>Tom</p>`;
    expect(response.item.plot.getHtml()).toContain(expectedHtml);
  });

  it(`checks that html contains resolved linked item content #2`, () => {
    const expectedHtml = `<p>Joel</p>`;
    expect(response.item.plot.getHtml()).toContain(expectedHtml);
  });

  it(`checks that html contains resolved url #1`, () => {
    const expectedHtml = `/actor/tom`;
    expect(response.item.plot.getHtml()).toContain(expectedHtml);
  });

  it(`checks that html contains resolved url #2`, () => {
    const expectedHtml = `/actor/joel`;
    expect(response.item.plot.getHtml()).toContain(expectedHtml);
  });

  it(`elements property should be set`, () => {
    expect(response.item.elements).toBeDefined();
    expect(response.item.elements.title.value).toEqual(response.item.title.text);
  });

  it(`images should be mapped in plot rich text field`, () => {
    const images = response.item.plot.images;

    expect(images).toBeDefined();
    expect(images.length).toEqual(2);

    images.forEach(image => {
      expect(image).toEqual(jasmine.any(RichTextImage));

      // get original image
      const newImageUrl = image.url + '?xParam=xValue';
      const plotHtml = response.item.plot.getHtml();

      expect(plotHtml).toContain(`src="${newImageUrl}"`);
    });
  });

});

