import { GET as getTasks, POST as createTask } from '@/app/api/tasks/route';
import { PUT as updateTask, DELETE as deleteTask } from '@/app/api/tasks/[id]/route';
import { GET as getJournal, POST as createJournal } from '@/app/api/journal/route';
import { GET as getRewards } from '@/app/api/rewards/route';
import { GET as getAffirmations } from '@/app/api/affirmations/route';
import { getServerSession } from 'next-auth';

jest.mock('next-auth', () => ({
  getServerSession: jest.fn(),
}));

jest.mock('@/lib/db-init', () => ({
  getDatabase: jest.fn(),
}));

jest.mock('@/lib/mongodb', () => ({
  __esModule: true,
  default: Promise.resolve({
    db: jest.fn(() => ({
      collection: jest.fn(),
    })),
  }),
}));

describe('API Endpoints Tests - Agent 6', () => {
  const mockSession = {
    user: {
      id: 'test-user-id',
      email: 'test@example.com',
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('/api/tasks - GET', () => {
    it('should return 401 without authentication', async () => {
      (getServerSession as jest.Mock).mockResolvedValue(null);
      
      const response = await getTasks();
      const data = await response.json();
      
      expect(response.status).toBe(401);
      expect(data.error).toBe('Unauthorized');
    });

    it('should return array of tasks with authentication', async () => {
      (getServerSession as jest.Mock).mockResolvedValue(mockSession);
      
      const mockDb = {
        collection: jest.fn(() => ({
          find: jest.fn(() => ({
            sort: jest.fn(() => ({
              toArray: jest.fn(() => Promise.resolve([
                {
                  _id: { toString: () => '1' },
                  title: 'Test Task',
                  description: 'Test Description',
                  completed: false,
                  dueDate: new Date('2025-10-30'),
                  priority: 'medium',
                  subtasks: [],
                }
              ])),
            })),
          })),
        })),
      };

      const { getDatabase } = require('@/lib/db-init');
      (getDatabase as jest.Mock).mockResolvedValue(mockDb);
      
      const response = await getTasks();
      const data = await response.json();
      
      expect(response.status).toBe(200);
      expect(Array.isArray(data)).toBe(true);
    });
  });

  describe('/api/tasks - POST', () => {
    it('should return 401 without authentication', async () => {
      (getServerSession as jest.Mock).mockResolvedValue(null);
      
      const mockRequest = {
        json: async () => ({
          title: 'New Task',
          completed: false,
          dueDate: new Date().toISOString(),
          priority: 'medium',
          subtasks: [],
        }),
      } as any;
      
      const response = await createTask(mockRequest);
      const data = await response.json();
      
      expect(response.status).toBe(401);
      expect(data.error).toBe('Unauthorized');
    });

    it('should return 400 with invalid data', async () => {
      (getServerSession as jest.Mock).mockResolvedValue(mockSession);
      
      const mockRequest = {
        json: async () => ({
          title: '',
        }),
      } as any;
      
      const response = await createTask(mockRequest);
      const data = await response.json();
      
      expect(response.status).toBe(400);
      expect(data.error).toBe('Invalid task data');
    });

    it('should create task with valid data', async () => {
      (getServerSession as jest.Mock).mockResolvedValue(mockSession);
      
      const mockDb = {
        collection: jest.fn(() => ({
          insertOne: jest.fn(() => Promise.resolve({
            insertedId: { toString: () => 'new-task-id' },
          })),
        })),
      };

      const { getDatabase } = require('@/lib/db-init');
      (getDatabase as jest.Mock).mockResolvedValue(mockDb);
      
      const mockRequest = {
        json: async () => ({
          title: 'New Task',
          description: 'Test',
          completed: false,
          dueDate: new Date().toISOString(),
          priority: 'medium',
          subtasks: [],
        }),
      } as any;
      
      const response = await createTask(mockRequest);
      const data = await response.json();
      
      expect(response.status).toBe(201);
      expect(data.title).toBe('New Task');
    });
  });

  describe('/api/tasks/[id] - PUT', () => {
    it('should return 401 without authentication', async () => {
      (getServerSession as jest.Mock).mockResolvedValue(null);
      
      const mockRequest = {
        json: async () => ({ completed: true }),
      } as any;
      
      const mockParams = Promise.resolve({ id: 'task-id' });
      
      const response = await updateTask(mockRequest, { params: mockParams });
      const data = await response.json();
      
      expect(response.status).toBe(401);
      expect(data.error).toBe('Unauthorized');
    });
  });

  describe('/api/tasks/[id] - DELETE', () => {
    it('should return 401 without authentication', async () => {
      (getServerSession as jest.Mock).mockResolvedValue(null);
      
      const mockRequest = {} as any;
      const mockParams = Promise.resolve({ id: 'task-id' });
      
      const response = await deleteTask(mockRequest, { params: mockParams });
      const data = await response.json();
      
      expect(response.status).toBe(401);
      expect(data.error).toBe('Unauthorized');
    });
  });

  describe('/api/journal - GET', () => {
    it('should return 401 without authentication', async () => {
      (getServerSession as jest.Mock).mockResolvedValue(null);
      
      const response = await getJournal();
      const data = await response.json();
      
      expect(response.status).toBe(401);
      expect(data.error).toBe('Unauthorized');
    });
  });

  describe('/api/journal - POST', () => {
    it('should return 400 with invalid data', async () => {
      (getServerSession as jest.Mock).mockResolvedValue(mockSession);
      
      const mockRequest = {
        json: async () => ({
          mood: 'invalid-mood',
        }),
      } as any;
      
      const response = await createJournal(mockRequest);
      const data = await response.json();
      
      expect(response.status).toBe(400);
      expect(data.error).toBe('Invalid journal entry data');
    });
  });

  describe('/api/rewards - GET', () => {
    it('should return 401 without authentication', async () => {
      (getServerSession as jest.Mock).mockResolvedValue(null);
      
      const response = await getRewards();
      const data = await response.json();
      
      expect(response.status).toBe(401);
      expect(data.error).toBe('Unauthorized');
    });
  });

  describe('/api/affirmations - GET', () => {
    it('should return a random affirmation', async () => {
      const response = await getAffirmations();
      const data = await response.json();
      
      expect(response.status).toBe(200);
      expect(data).toHaveProperty('affirmation');
      expect(data).toHaveProperty('index');
      expect(data).toHaveProperty('total');
      expect(typeof data.affirmation).toBe('string');
      expect(data.total).toBe(20);
    });

    it('should return different affirmations on multiple calls', async () => {
      const affirmations = new Set();
      
      for (let i = 0; i < 10; i++) {
        const response = await getAffirmations();
        const data = await response.json();
        affirmations.add(data.affirmation);
      }
      
      expect(affirmations.size).toBeGreaterThan(1);
    });
  });
});
