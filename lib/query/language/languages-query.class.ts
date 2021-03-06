import { Observable } from 'rxjs';

import { IDeliveryClientConfig } from '../../config';
import { LanguageResponses, Parameters } from '../../models';
import { QueryService } from '../../services';
import { BaseLanguageQuery } from './base-language-query.class';

export class LanguagesQuery extends BaseLanguageQuery<LanguageResponses.ListLanguagesResponse> {
    constructor(protected config: IDeliveryClientConfig, protected queryService: QueryService) {
        super(config, queryService);
    }

    /**
     * Limits the number of taxonomies returned by query
     * @param limit Number of taxonomies to load
     */
    limitParameter(limit: number): this {
        this.parameters.push(new Parameters.LimitParameter(limit));
        return this;
    }

    /**
     * Skips the selected number of taxonomies
     * @param skip Number of taxonomies to skip
     */
    skipParameter(skip: number): this {
        this.parameters.push(new Parameters.SkipParameter(skip));
        return this;
    }

    /**
     * Gets the Observable
     */
    toObservable(): Observable<LanguageResponses.ListLanguagesResponse> {
        return super.runLanguagesQuery();
    }

    /**
     * Gets 'Url' representation of query
     */
    getUrl(): string {
        return super.getLanguagesQueryUrl();
    }
}
