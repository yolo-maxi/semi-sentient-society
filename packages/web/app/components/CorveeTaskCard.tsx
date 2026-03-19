'use client';

import { useState } from 'react';
import type { CorveeTask } from '../../data/mock-corvee';

interface CorveeTaskCardProps {
  task: CorveeTask;
}

function difficultyClassName(difficulty: CorveeTask['difficulty']) {
  switch (difficulty) {
    case 'Easy':
      return 'corvee-badge corvee-badge-easy';
    case 'Medium':
      return 'corvee-badge corvee-badge-medium';
    case 'Hard':
      return 'corvee-badge corvee-badge-hard';
    default:
      return 'corvee-badge';
  }
}

function statusClassName(status: CorveeTask['status']) {
  switch (status) {
    case 'Open':
      return 'corvee-status corvee-status-open';
    case 'In Progress':
      return 'corvee-status corvee-status-progress';
    case 'Review':
      return 'corvee-status corvee-status-review';
    default:
      return 'corvee-status';
  }
}

export default function CorveeTaskCard({ task }: CorveeTaskCardProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <article className={`corvee-task-card${expanded ? ' expanded' : ''}`}>
      <div className="corvee-task-header">
        <div>
          <div className="corvee-task-meta">
            <span className={difficultyClassName(task.difficulty)}>{task.difficulty}</span>
            <span className={statusClassName(task.status)}>{task.status}</span>
          </div>
          <h3>{task.title}</h3>
        </div>
        <button
          type="button"
          className="corvee-expand-button"
          onClick={() => setExpanded((current) => !current)}
          aria-expanded={expanded}
        >
          {expanded ? 'Collapse' : 'Open Task'}
        </button>
      </div>

      <p className="corvee-task-snippet">{task.descriptionSnippet}</p>

      <div className="corvee-task-stats">
        <div className="corvee-task-stat">
          <span>Est. Time</span>
          <strong>{task.estimatedTime}</strong>
        </div>
        <div className="corvee-task-stat">
          <span>Reward</span>
          <strong>{task.reward} cSSS</strong>
        </div>
        <div className="corvee-task-stat">
          <span>Specialization</span>
          <strong>{task.requiredSpecialization}</strong>
        </div>
      </div>

      <div className="corvee-task-footer">
        <div className="corvee-tag-row">
          {task.specializationTags.map((tag) => (
            <span key={tag} className="corvee-tag">
              {tag}
            </span>
          ))}
        </div>
        <div className="corvee-claimed-by">
          {task.claimedBy ? `Claimed by ${task.claimedBy}` : 'Unclaimed'}
        </div>
      </div>

      {expanded && (
        <div className="corvee-task-expanded">
          <div className="corvee-expanded-block">
            <span className="corvee-block-label">Full Brief</span>
            <p>{task.description}</p>
          </div>

          <div className="corvee-expanded-grid">
            <div className="corvee-expanded-block">
              <span className="corvee-block-label">Submission Area</span>
              <p>{task.submissionPrompt}</p>
              <div className="corvee-submission-box">
                {task.submissionDraft ?? 'No draft submitted yet. Claim the task to start work.'}
              </div>
            </div>

            <div className="corvee-expanded-block">
              <span className="corvee-block-label">Peer Review</span>
              <div className="corvee-review-list">
                {task.peerReview.map((entry) => (
                  <div key={`${task.id}-${entry.reviewer}`} className="corvee-review-item">
                    <div className="corvee-review-header">
                      <strong>{entry.reviewer}</strong>
                      <span>{entry.outcome}</span>
                    </div>
                    <p>{entry.summary}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </article>
  );
}
