const API_BASE_URL = 'http://localhost:5000';

class ApiService {
  private async request(endpoint: string, options: RequestInit = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config: RequestInit = {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`API request failed for ${endpoint}:`, error);
      throw error;
    }
  }

  private async uploadFile(endpoint: string, file: File, additionalData?: Record<string, string>) {
    const url = `${API_BASE_URL}${endpoint}`;
    const formData = new FormData();
    formData.append('file', file);
    
    if (additionalData) {
      Object.entries(additionalData).forEach(([key, value]) => {
        formData.append(key, value);
      });
    }

    try {
      const response = await fetch(url, {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`File upload failed for ${endpoint}:`, error);
      throw error;
    }
  }

  // Get all certifications with lessons and subparts
  async getCertifications() {
    return this.request('/lessons-and-subparts');
  }

  // Add new certification
  async addCertification(name: string) {
    return this.request('/admin/certifications', {
      method: 'POST',
      body: JSON.stringify({ name }),
    });
  }

  // Add quiz to certification
  async addQuiz(certId: number, quizData: { question: string; options: string[]; answer: string }) {
    return this.request(`/admin/certifications/${certId}/quiz`, {
      method: 'POST',
      body: JSON.stringify(quizData),
    });
  }

  // Edit quiz
  async editQuiz(certId: number, quizId: number, quizData: { question: string; options: string[]; answer: string }) {
    return this.request(`/admin/certifications/${certId}/quiz/${quizId}`, {
      method: 'PUT',
      body: JSON.stringify(quizData),
    });
  }

  // Add video to certification
  async addVideo(certId: number, file: File, title: string) {
    return this.uploadFile(`/admin/certifications/${certId}/video`, file, { title });
  }

  // Add lab guide to certification
  async addLabGuide(certId: number, file: File) {
    return this.uploadFile(`/admin/certifications/${certId}/lab`, file);
  }

  // Add lesson to certification
  async addLesson(certId: number, title: string) {
    return this.request('/admin/lessons', {
      method: 'POST',
      body: JSON.stringify({ 
        title, 
        certification_id: certId 
      }),
    });
  }

  // Add subpart to lesson
  async addSubpart(lessonId: number, title: string, duration: string) {
    return this.request('/admin/subparts', {
      method: 'POST',
      body: JSON.stringify({ 
        title, 
        duration, 
        lesson_id: lessonId 
      }),
    });
  }

  // Delete certification
  async deleteCertification(certId: number) {
    return this.request(`/admin/certifications/${certId}`, {
      method: 'DELETE',
    });
  }

  // Delete quiz
  async deleteQuiz(certId: number, quizId: number) {
    return this.request(`/admin/certifications/${certId}/quiz/${quizId}`, {
      method: 'DELETE',
    });
  }

  // Delete video
  async deleteVideo(certId: number, videoId: number) {
    return this.request(`/admin/certifications/${certId}/video/${videoId}`, {
      method: 'DELETE',
    });
  }

  // Delete lab guide
  async deleteLabGuide(certId: number, labId: number) {
    return this.request(`/admin/certifications/${certId}/lab/${labId}`, {
      method: 'DELETE',
    });
  }

  // Get certification by name
  async getCertificationByName(name: string) {
    return this.request(`/api/certifications/by-name?name=${encodeURIComponent(name)}`);
  }

  // Get lab guide for certification
  async getLabGuide(certId: number) {
    return this.request(`/admin/certifications/${certId}/lab`);
  }

  async getRecommendedJobs() {
  return this.request('/jobs');
}
  // Get video for certification
  async getVideo(certId: number) {
    return this.request(`/admin/certifications/${certId}/video`);
  }
}




export const apiService = new ApiService();