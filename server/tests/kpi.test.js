import request from 'supertest';
import express from 'express';
import kpiRoutes from '../src/presentation/routes/kpi.route.js';
import { jest } from '@jest/globals';

const app = express();
app.use(express.json());
app.use('/kpi', kpiRoutes);
app.use(express.json());
app.use('/kpi', kpiRoutes);

describe('KPI Controller', () => {
    it('should get all KPIs', async () => {
        const res = await request(app).get('/kpi/kpis');
        expect(res.statusCode).toEqual(200);
        expect(res.body).toBeInstanceOf(Array);
        expect(res.body[0]).toHaveProperty('totalRevenue');
    });
});
