import React, { useState, useMemo } from 'react';
import { CRMIcon } from '../components/CRMIcon';

export const CRMTasksView = ({
  tasks = [],
  onUpdateTask
}) => {
  const [filterTab, setFilterTab] = useState('all'); // 'all' | 'today' | 'upcoming' | 'overdue' | 'completed'

  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const todayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);

  const filteredTasks = useMemo(() => {
    return tasks.filter((t) => {
      const due = t.dueDate ? new Date(t.dueDate) : null;
      if (filterTab === 'completed') return t.completed;
      if (filterTab === 'overdue') return !t.completed && due && due < todayStart;
      if (filterTab === 'today') return !t.completed && due && due >= todayStart && due <= todayEnd;
      if (filterTab === 'upcoming') return !t.completed && due && due > todayEnd;
      return true; // all
    });
  }, [tasks, filterTab, todayStart, todayEnd]);

  const overdueCount = tasks.filter((t) => !t.completed && t.dueDate && new Date(t.dueDate) < todayStart).length;
  const todayCount = tasks.filter((t) => !t.completed && t.dueDate && new Date(t.dueDate) >= todayStart && new Date(t.dueDate) <= todayEnd).length;
  const completedCount = tasks.filter((t) => t.completed).length;

  return (
    <div className="crm-workspace-view">
      {/* Tasks Toolbar */}
      <div className="crm-card crm-toolbar-card">
        <div className="crm-toolbar-row">
          <div className="crm-filter-chips" role="tablist">
            {[
              { id: 'all', label: 'All Tasks', count: tasks.length },
              { id: 'today', label: 'Due Today', count: todayCount },
              { id: 'overdue', label: 'Overdue', count: overdueCount },
              { id: 'upcoming', label: 'Upcoming', count: tasks.filter((t) => !t.completed && t.dueDate && new Date(t.dueDate) > todayEnd).length },
              { id: 'completed', label: 'Completed', count: completedCount }
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={filterTab === tab.id}
                className={`crm-filter-chip ${filterTab === tab.id ? 'active' : ''}`}
                onClick={() => setFilterTab(tab.id)}
              >
                <span>{tab.label}</span>
                <span className="chip-count">{tab.count}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Task Cards Container */}
      <div className="crm-card" style={{ marginTop: '16px' }}>
        <div className="crm-card__header">
          <div className="crm-card__header-title">
            <CRMIcon name="tasks" size={18} />
            <h3>Sales Tasks &amp; Action Reminders</h3>
            <span className="crm-badge crm-badge-red">
              {overdueCount > 0 ? `${overdueCount} Overdue` : 'On Schedule'}
            </span>
          </div>
        </div>

        <div className="crm-card__body">
          {filteredTasks.length === 0 ? (
            <div className="crm-empty-state" style={{ padding: '36px' }}>
              <CRMIcon name="check" size={36} className="empty-check-icon" />
              <h4>No tasks found for this filter</h4>
              <p>All follow-ups, quotation reminders, and calls are resolved.</p>
            </div>
          ) : (
            <div className="crm-tasks-grid">
              {filteredTasks.map((t) => {
                const isOverdue = !t.completed && t.dueDate && new Date(t.dueDate) < todayStart;

                return (
                  <div
                    key={t._id}
                    className={`crm-task-card ${t.completed ? 'completed' : ''} ${isOverdue ? 'overdue' : ''}`}
                  >
                    <div className="crm-task-card__main">
                      <div className="crm-task-card__header">
                        <span className={`crm-pill crm-pill-${t.priority === 'High' ? 'red' : t.priority === 'Medium' ? 'amber' : 'blue'}`}>
                          {t.priority || 'Normal'} Priority
                        </span>
                        {isOverdue && (
                          <span className="crm-badge crm-badge-red">Overdue</span>
                        )}
                      </div>

                      <h4 className="crm-task-card__title">{t.title}</h4>

                      {t.description && (
                        <p className="crm-task-card__desc">{t.description}</p>
                      )}

                      <div className="crm-task-card__meta">
                        <span>
                          📅 Due: {t.dueDate ? new Date(t.dueDate).toLocaleDateString() : 'No date'}
                        </span>
                        <span>
                          👤 Assigned: {t.assignedTo?.name || 'Staff User'}
                        </span>
                      </div>
                    </div>

                    <div className="crm-task-card__actions">
                      <button
                        type="button"
                        className={`crm-btn crm-btn-sm ${t.completed ? 'crm-btn-outline' : 'crm-btn-primary'}`}
                        onClick={() => onUpdateTask?.(t._id, { completed: !t.completed })}
                      >
                        {t.completed ? 'Mark Incomplete' : '✓ Mark Complete'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CRMTasksView;
