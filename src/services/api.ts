// Placeholder API service until the real API is available
export const environmentApi = {
  getMonitoringStats: async () => {
    // Simulating API response delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Return mock data
    return {
      success: true,
      data: {
        hectaresMonitored: 5822,
        riskAreasIdentified: 42,
        deforestationAlerts: 127,
        airQualityIndex: 61
      }
    };
  }
};

// Event API service for managing events
export const eventApi = {
  getAllEvents: async () => {
    // Simulating API response delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Return mock data for events
    return {
      success: true,
      data: [
        {
          id: "evt1",
          title: "Plantio de Árvores no Parque",
          description: "Venha participar do nosso evento de plantio de árvores para reflorestamento urbano.",
          date: "2025-05-20",
          time: "09:00",
          address: "Parque Municipal, Rua das Flores, 100",
          organizer: "Secretaria de Meio Ambiente",
          lat: -22.120092,
          lng: -51.379639,
          createdBy: "admin1",
          createdAt: "2025-04-01"
        },
        {
          id: "evt2",
          title: "Feira de Produtos Orgânicos",
          description: "Uma feira com os melhores produtores orgânicos da região.",
          date: "2025-05-15",
          time: "08:00",
          address: "Praça Central, Avenida Principal, 200",
          organizer: "Associação de Produtores Orgânicos",
          lat: -22.125192,
          lng: -51.385639,
          createdBy: "admin1",
          createdAt: "2025-04-02"
        },
        {
          id: "evt3",
          title: "Workshop de Compostagem",
          description: "Aprenda a fazer compostagem doméstica e reduza seu lixo orgânico.",
          date: "2025-06-05",
          time: "14:00",
          address: "Centro Comunitário, Rua dos Ipês, 500",
          organizer: "Instituto EcoVida",
          lat: -22.130092,
          lng: -51.389639,
          createdBy: "admin2",
          createdAt: "2025-04-10"
        }
      ]
    };
  },
  
  getEventRequests: async () => {
    // Simulating API response delay
    await new Promise(resolve => setTimeout(resolve, 400));
    
    // Return mock data for event requests
    return {
      success: true,
      data: [
        {
          id: "req1",
          title: "Limpeza da Praia",
          description: "Evento comunitário para limpeza da orla da praia.",
          date: "2025-06-15",
          time: "08:00",
          address: "Praia Municipal, Entrada Principal",
          organizer: "Grupo Amigos do Mar",
          createdBy: "user1",
          createdAt: "2025-04-15"
        },
        {
          id: "req2",
          title: "Troca de Sementes",
          description: "Evento para troca de sementes e mudas entre jardineiros urbanos.",
          date: "2025-06-20",
          time: "10:00",
          address: "Horta Comunitária, Rua das Hortênsias, 80",
          organizer: "Coletivo Jardins Urbanos",
          createdBy: "user2",
          createdAt: "2025-04-18"
        }
      ]
    };
  },
  
  addEvent: async (eventData) => {
    // Simulating API response delay
    await new Promise(resolve => setTimeout(resolve, 600));
    
    // Generate a new ID for the event
    const newId = `evt${Date.now()}`;
    
    // Return the new event with its ID
    return {
      success: true,
      data: {
        id: newId,
        ...eventData,
        createdAt: new Date().toISOString()
      }
    };
  },
  
  addEventRequest: async (requestData) => {
    // Simulating API response delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Generate a new ID for the request
    const newId = `req${Date.now()}`;
    
    // Return the new request with its ID
    return {
      success: true,
      data: {
        id: newId,
        ...requestData,
        createdAt: new Date().toISOString()
      }
    };
  }
};

// User API service for managing users
export const userApi = {
  getAllUsers: async () => {
    // Simulating API response delay
    await new Promise(resolve => setTimeout(resolve, 600));
    
    // Return mock data for users
    return {
      success: true,
      data: [
        {
          id: '1',
          name: 'Admin',
          email: 'admin@terraverde.com',
          isAdmin: true,
        },
        {
          id: '2',
          name: 'Usuário',
          email: 'usuario@terraverde.com',
          isAdmin: false,
        },
        {
          id: '3',
          name: 'Maria Silva',
          email: 'maria@terraverde.com',
          isAdmin: false,
        },
        {
          id: '4',
          name: 'João Santos',
          email: 'joao@terraverde.com',
          isAdmin: false,
        }
      ]
    };
  },
  
  getUserById: async (userId) => {
    // Simulating API response delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Mock data for specific user
    const users = {
      '1': { id: '1', name: 'Admin', email: 'admin@terraverde.com', isAdmin: true },
      '2': { id: '2', name: 'Usuário', email: 'usuario@terraverde.com', isAdmin: false },
      '3': { id: '3', name: 'Maria Silva', email: 'maria@terraverde.com', isAdmin: false },
      '4': { id: '4', name: 'João Santos', email: 'joao@terraverde.com', isAdmin: false }
    };
    
    if (users[userId]) {
      return {
        success: true,
        data: users[userId]
      };
    } else {
      return {
        success: false,
        error: 'User not found'
      };
    }
  },
  
  updateUserAdmin: async (userId, isAdmin) => {
    // Simulating API response delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Simulate successful update
    return {
      success: true,
      data: {
        id: userId,
        isAdmin
      }
    };
  }
};
