import React from 'react';
import { render, screen } from '@testing-library/react';
import ReportView from '../../LabReports/ReportView';

describe('ReportView component', () => {
    it('renders without crashing', () => {
        render(<ReportView />);
    });

    it('renders the print button', () => {
        render(<ReportView />);
        expect(screen.getByText('Print')).toBeInTheDocument();
    });

});
