import mysql from 'mysql2/promise';

// Database configuration
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '', // No password for local development
  database: 'customer_capital_dashboard',
  port: 3306
};

// Create connection pool
const pool = mysql.createPool(dbConfig);

// Database service class
export class DatabaseService {
  
  // Get all projects with their details
  static async getAllProjects() {
    try {
      const [rows] = await pool.execute(`
        SELECT 
          p.*,
          pd.purpose,
          pd.actionable_data,
          pd.go_live_date,
          pd.contact_points,
          pd.challenges,
          pd.notes
        FROM projects p
        LEFT JOIN project_details pd ON p.id = pd.project_id
        ORDER BY p.created_at DESC
      `);
      
      return rows;
    } catch (error) {
      console.error('Error fetching projects:', error);
      throw error;
    }
  }

  // Get project by ID
  static async getProjectById(id: number) {
    try {
      const [rows] = await pool.execute(`
        SELECT 
          p.*,
          pd.purpose,
          pd.actionable_data,
          pd.go_live_date,
          pd.contact_points,
          pd.challenges,
          pd.notes
        FROM projects p
        LEFT JOIN project_details pd ON p.id = pd.project_id
        WHERE p.id = ?
      `, [id]);
      
      return rows[0];
    } catch (error) {
      console.error('Error fetching project:', error);
      throw error;
    }
  }

  // Get projects by status
  static async getProjectsByStatus(status: string) {
    try {
      const [rows] = await pool.execute(`
        SELECT * FROM projects 
        WHERE status = ?
        ORDER BY created_at DESC
      `, [status]);
      
      return rows;
    } catch (error) {
      console.error('Error fetching projects by status:', error);
      throw error;
    }
  }

  // Create new project
  static async createProject(projectData: any) {
    try {
      const [result] = await pool.execute(`
        INSERT INTO projects (
          project_name, description, status, priority, 
          assigned_to, eta, due_date, start_date, end_date, 
          progress_percentage, budget, actual_cost
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        projectData.project_name,
        projectData.description,
        projectData.status || 'development',
        projectData.priority || 'medium',
        projectData.assigned_to,
        projectData.eta,
        projectData.due_date,
        projectData.start_date,
        projectData.end_date,
        projectData.progress_percentage || 0,
        projectData.budget,
        projectData.actual_cost
      ]);
      
      return result;
    } catch (error) {
      console.error('Error creating project:', error);
      throw error;
    }
  }

  // Update project
  static async updateProject(id: number, projectData: any) {
    try {
      const [result] = await pool.execute(`
        UPDATE projects SET
          project_name = ?,
          description = ?,
          status = ?,
          priority = ?,
          assigned_to = ?,
          eta = ?,
          due_date = ?,
          start_date = ?,
          end_date = ?,
          progress_percentage = ?,
          budget = ?,
          actual_cost = ?,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `, [
        projectData.project_name,
        projectData.description,
        projectData.status,
        projectData.priority,
        projectData.assigned_to,
        projectData.eta,
        projectData.due_date,
        projectData.start_date,
        projectData.end_date,
        projectData.progress_percentage,
        projectData.budget,
        projectData.actual_cost,
        id
      ]);
      
      return result;
    } catch (error) {
      console.error('Error updating project:', error);
      throw error;
    }
  }

  // Delete project
  static async deleteProject(id: number) {
    try {
      const [result] = await pool.execute(`
        DELETE FROM projects WHERE id = ?
      `, [id]);
      
      return result;
    } catch (error) {
      console.error('Error deleting project:', error);
      throw error;
    }
  }

  // Get project statistics
  static async getProjectStats() {
    try {
      const [rows] = await pool.execute(`
        SELECT 
          COUNT(*) as total_projects,
          COUNT(CASE WHEN status = 'development' THEN 1 END) as development_count,
          COUNT(CASE WHEN status = 'testing' THEN 1 END) as testing_count,
          COUNT(CASE WHEN status = 'implemented' THEN 1 END) as implemented_count,
          COUNT(CASE WHEN status = 'uat' THEN 1 END) as uat_count,
          COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_count,
          AVG(progress_percentage) as avg_progress
        FROM projects
      `);
      
      return rows[0];
    } catch (error) {
      console.error('Error fetching project stats:', error);
      throw error;
    }
  }

  // Get all users
  static async getAllUsers() {
    try {
      const [rows] = await pool.execute(`
        SELECT * FROM users 
        WHERE is_active = 1
        ORDER BY full_name
      `);
      
      return rows;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  }

  // Test database connection
  static async testConnection() {
    try {
      const [rows] = await pool.execute('SELECT 1 as test');
      console.log('✅ Database connection successful');
      return true;
    } catch (error) {
      console.error('❌ Database connection failed:', error);
      return false;
    }
  }
}

export default DatabaseService; 