export class StaticApiService {
  
  // Test API connection (always returns true for static data)
  static async testConnection() {
    return true;
  }

  // Get Project Synopsis data from static JSON
  static async getProjectSynopsisData() {
    try {
      const response = await fetch('/project-synopsis.json');
      const data = await response.json();
      
      if (data.success) {
        return data.data;
      } else {
        throw new Error(data.message || 'Failed to load project synopsis data');
      }
    } catch (error) {
      console.error('Error fetching Project Synopsis data:', error);
      throw error;
    }
  }

  // Get Project Synopsis by ID
  static async getProjectSynopsisById(id: number) {
    try {
      const allData = await this.getProjectSynopsisData();
      const project = allData.find((p: any) => p.id === id);
      
      if (project) {
        return project;
      } else {
        throw new Error(`Project with ID ${id} not found`);
      }
    } catch (error) {
      console.error('Error fetching Project Synopsis by ID:', error);
      throw error;
    }
  }

  // Get Customer Capital Work Details from static JSON
  static async getCustomerCapitalWorkDetails() {
    try {
      const response = await fetch('/customer-capital-work-details.json');
      const data = await response.json();
      
      if (data.success) {
        return data.data;
      } else {
        throw new Error(data.message || 'Failed to load customer capital work details');
      }
    } catch (error) {
      console.error('Error fetching Customer Capital Work Details:', error);
      throw error;
    }
  }

  // Get all projects (alias for getProjectSynopsisData)
  static async getAllProjects() {
    return this.getProjectSynopsisData();
  }

  // Get project by ID (alias for getProjectSynopsisById)
  static async getProjectById(id: number) {
    return this.getProjectSynopsisById(id);
  }

  // Mock methods for compatibility (return empty arrays/objects)
  static async createProject(projectData: any) {
    console.warn('Create project not available in static mode');
    return { id: Date.now(), ...projectData };
  }

  static async updateProject(id: number, projectData: any) {
    console.warn('Update project not available in static mode');
    return 'Project updated (mock)';
  }

  static async deleteProject(id: number) {
    console.warn('Delete project not available in static mode');
    return 'Project deleted (mock)';
  }

  static async getProjectStats() {
    console.warn('Project stats not available in static mode');
    return {
      total: 0,
      completed: 0,
      inProgress: 0,
      pending: 0
    };
  }

  static async getAllUsers() {
    console.warn('Users not available in static mode');
    return [];
  }
}

export default StaticApiService; 