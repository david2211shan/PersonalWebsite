/**
 * Configuration Loader
 * Loads site configuration from JSON file
 */
class ConfigLoader {
  constructor(configPath = 'data/config.json') {
    this.configPath = configPath;
    this.config = null;
  }

  async load() {
    try {
      const response = await fetch(this.configPath);
      if (!response.ok) {
        throw new Error(`Failed to load config: ${response.statusText}`);
      }
      this.config = await response.json();
      return this.config;
    } catch (error) {
      console.error('Error loading configuration:', error);
      // Fallback to default config or handle error
      return null;
    }
  }

  get(path) {
    if (!this.config) return null;
    const keys = path.split('.');
    let value = this.config;
    for (const key of keys) {
      if (value && typeof value === 'object' && key in value) {
        value = value[key];
      } else {
        return null;
      }
    }
    return value;
  }
}

// Export for use in other modules
window.ConfigLoader = ConfigLoader;

