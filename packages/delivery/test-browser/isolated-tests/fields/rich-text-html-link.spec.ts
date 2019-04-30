import {
    ContentItem,
    ContentItemSystemAttributes,
    Fields,
    IDeliveryClientConfig,
    Link,
    richTextResolver,
    TypeResolver,
    urlSlugResolver,
    getParserAdapter,
    ILinkResolverResult
} from '../../../lib';

class ActorMock extends ContentItem {
    firstName!: Fields.TextField;
    system!: ContentItemSystemAttributes;
    url!: Fields.UrlSlugField;

    constructor() {
        super();
    }

    setProperties(id: string, codename: string, firstName: string) {
        this.firstName = new Fields.TextField('firstName', firstName);
        this.system = new ContentItemSystemAttributes({
            id: id,
            name: 'name',
            codename: codename,
            type: 'actor',
            sitemapLocations: [],
            language: 'en',
            lastModified: new Date()
        });

        this.url = new Fields.UrlSlugField('name', codename, {
            resolveLink: () => urlSlugResolver.resolveUrl({
                fieldName: 'name',
                type: 'type',
                item: this,
                linkResolver: (link: Link) => <ILinkResolverResult>{
                    asHtml: `<test>${link.urlSlug}</test>`,
                },
                enableAdvancedLogging: true,
                fieldValue: codename
            })
        });
    }
}

describe('RichTextField with Html links', () => {
    // prepare config & type resolver
    const typeResolvers: TypeResolver[] = [
        new TypeResolver('actor', () => new ActorMock())
    ];

    const config: IDeliveryClientConfig = {
        projectId: '',
        typeResolvers: typeResolvers
    };

    // prepare linked items
    const linkedItems: ActorMock[] = [];

    const tomHardyId = 'd1557cb1-d7ec-4d04-9742-f86b52bc34fc';
    const joelEdgertonId = '3294e4b0-e58b-49d7-85fa-5bc9a86556ec';

    const tomHardy = new ActorMock();
    tomHardy.setProperties(tomHardyId, 'tom_hardy', 'Tom');

    const joelEdgerton = new ActorMock();
    joelEdgerton.setProperties(joelEdgertonId, 'joel_edgerton', 'Joel');

    // prepare links
    const links: Link[] = [
        new Link({
            linkId: tomHardy.system.id,
            codename: tomHardy.system.codename,
            type: tomHardy.system.type,
            urlSlug: 'slug_for_tom',
        }),
        new Link({
            linkId: joelEdgerton.system.id,
            codename: joelEdgerton.system.codename,
            type: joelEdgerton.system.type,
            urlSlug: 'slug_for_joel',
        })
    ];

    linkedItems.push(tomHardy);
    linkedItems.push(joelEdgerton);

    const beforeLinkText = 'BEFORELINK';
    const afterLinkText = 'AFTERLINK';

    const getLinkedItem: (codename: string) => ContentItem | undefined = (codename) => linkedItems.find(m => m.system.codename === codename);

    // prepare html
    // tslint:disable:max-line-length
    const html = `
    <p>The youngest son of an alcoholic former boxer returns home, where he's trained by his father for competition in a mixed martial arts tournament - a path that puts the fighter on a collision course with his estranged, older brother.</p>\n<p>Stars:&nbsp;</p>\n<object type=\"application/kenticocloud\" data-type=\"item\" data-codename=\"tom_hardy\"></object>\n<object type=\"application/kenticocloud\" data-type=\"item\" data-codename=\"joel_edgerton\"></object>\n<p>See more in profile of ${beforeLinkText}<a data-item-id=\"3294e4b0-e58b-49d7-85fa-5bc9a86556ec\" href=\"\">Joel Edgerton</a>${afterLinkText} and ${beforeLinkText}<a data-item-id=\"d1557cb1-d7ec-4d04-9742-f86b52bc34fc\" href=\"\">Tom Hardy</a>${afterLinkText}</p>
    `;

    it(`checks that links are resolved as HTML`, () => {

        const fieldWithoutRichTextResolver = new Fields.RichTextField('name', html, linkedItems.map(m => m.system.codename), {
            links: links,
            resolveHtml: () => richTextResolver.resolveHtml('', html, 'name', {
                enableAdvancedLogging: false,
                links: links,
                getLinkedItem: getLinkedItem,
                typeResolvers: config.typeResolvers as TypeResolver[],
                images: [],
                richTextHtmlParser: getParserAdapter(),
                linkedItemWrapperClasses: ['kc-wrapper-class'],
                linkedItemWrapperTag: 'kc-item-wrapper',
                queryConfig: {
                    richTextResolver: undefined as any,
                    linkResolver: (link) => <ILinkResolverResult>{
                        asHtml: `<test>${link.urlSlug}</test>`,
                    }
                },
            }),
            images: []
        });

        const expectedHtml1 = `${beforeLinkText}<test>slug_for_joel</test>${afterLinkText}`;
        const expectedHtml2 = `${beforeLinkText}<test>slug_for_tom</test>${afterLinkText}`;
        expect(fieldWithoutRichTextResolver.getHtml()).toContain(expectedHtml1);
        expect(fieldWithoutRichTextResolver.getHtml()).toContain(expectedHtml2);
    });
});

