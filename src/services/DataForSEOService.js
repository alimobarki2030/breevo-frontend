// Complete DataForSEO Service - Direct API Integration
// Replace your existing DataForSEOService.js with this file

class DataForSEOService {
  constructor() {
    this.baseURL = 'https://api.dataforseo.com/v3';
    this.credentials = {
      login: process.env.REACT_APP_DATAFORSEO_LOGIN,
      password: process.env.REACT_APP_DATAFORSEO_PASSWORD
    };
    
    // Rate limiting
    this.lastRequest = 0;
    this.minRequestInterval = 100; // 100ms between requests
  }

  // Helper method to handle rate limiting
  async waitForRateLimit() {
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequest;
    
    if (timeSinceLastRequest < this.minRequestInterval) {
      await new Promise(resolve => 
        setTimeout(resolve, this.minRequestInterval - timeSinceLastRequest)
      );
    }
    
    this.lastRequest = Date.now();
  }

  // Generic API request method
  async makeRequest(endpoint, data) {
    await this.waitForRateLimit();

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Basic ' + btoa(`${this.credentials.login}:${this.credentials.password}`)
        },
        body: JSON.stringify(Array.isArray(data) ? data : [data])
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API Error ${response.status}: ${errorText}`);
      }

      const result = await response.json();
      
      // Log costs for monitoring
      if (result.cost) {
        console.log(`DataForSEO API Cost: ${result.cost} credits`);
      }

      return result;
    } catch (error) {
      console.error('DataForSEO API Error:', error);
      throw new Error(`خطأ في الاتصال بالخدمة: ${error.message}`);
    }
  }

  // Keyword Research Methods
  async getKeywordData(keywords, location = "Saudi Arabia", language = "Arabic") {
    const endpoint = '/keywords_data/google_ads/search_volume/live';
    const data = {
      keywords: Array.isArray(keywords) ? keywords : [keywords],
      location_name: location,
      language_name: language
    };

    return this.makeRequest(endpoint, data);
  }

  async getRelatedKeywords(keyword, location = "Saudi Arabia", language = "Arabic", limit = 50) {
    const endpoint = '/dataforseo_labs/google/related_keywords/live';
    const data = {
      keyword,
      location_name: location,
      language_name: language,
      limit
    };

    return this.makeRequest(endpoint, data);
  }

  // Competitor Analysis Methods
  async getDomainOverview(domain, location = "Saudi Arabia", language = "Arabic") {
    const endpoint = '/dataforseo_labs/google/domain_overview/live';
    const data = {
      target: domain,
      location_name: location,
      language_name: language
    };

    return this.makeRequest(endpoint, data);
  }

  async getCompetitors(domain, location = "Saudi Arabia", language = "Arabic", limit = 20) {
    const endpoint = '/dataforseo_labs/google/competitors_domain/live';
    const data = {
      target: domain,
      location_name: location,
      language_name: language,
      limit
    };

    return this.makeRequest(endpoint, data);
  }

  async getRankedKeywords(domain, location = "Saudi Arabia", language = "Arabic", limit = 100) {
    const endpoint = '/dataforseo_labs/google/ranked_keywords/live';
    const data = {
      target: domain,
      location_name: location,
      language_name: language,
      limit
    };

    return this.makeRequest(endpoint, data);
  }

  async getBacklinksSummary(domain) {
    const endpoint = '/backlinks/summary/live';
    const data = {
      target: domain,
      internal_list_limit: 10
    };

    return this.makeRequest(endpoint, data);
  }

  async getDomainIntersection(domains, location = "Saudi Arabia", language = "Arabic", limit = 50) {
    const endpoint = '/dataforseo_labs/google/domain_intersection/live';
    const data = {
      targets: domains,
      location_name: location,
      language_name: language,
      limit
    };

    return this.makeRequest(endpoint, data);
  }

  // Batch processing for multiple keywords
  async batchKeywordAnalysis(keywords, location = "Saudi Arabia", language = "Arabic") {
    const batchSize = 10; // Process 10 keywords at a time
    const results = [];

    for (let i = 0; i < keywords.length; i += batchSize) {
      const batch = keywords.slice(i, i + batchSize);
      try {
        const result = await this.getKeywordData(batch, location, language);
        results.push(...(result.tasks?.[0]?.result || []));
        
        // Small delay between batches
        if (i + batchSize < keywords.length) {
          await new Promise(resolve => setTimeout(resolve, 200));
        }
      } catch (error) {
        console.error(`Batch ${i}-${i + batchSize} failed:`, error);
      }
    }

    return results;
  }

  // Helper method to format Saudi currency
  formatSaudiPrice(usdPrice) {
    if (!usdPrice) return 'غير متوفر';
    const sarPrice = usdPrice * 3.75;
    return `${sarPrice.toFixed(2)} ريال`;
  }

  // Helper method to format numbers in Arabic
  formatArabicNumber(number) {
    if (!number) return 'غير متوفر';
    return number.toLocaleString('ar-SA');
  }
}

// Export singleton instance
export default new DataForSEOService();