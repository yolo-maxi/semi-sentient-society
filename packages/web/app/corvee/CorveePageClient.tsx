'use client';

import { useMemo, useState } from 'react';
import FadeIn from '../components/FadeIn';
import SiteNav from '../components/SiteNav';
import CorveeTaskCard from '../components/CorveeTaskCard';
import {
  MOCK_CORVEE_TASKS,
  type CorveeDifficulty,
  type CorveeStatus,
} from '../../data/mock-corvee';

const SPECIALIZATION_TAGS = Array.from(
  new Set(MOCK_CORVEE_TASKS.flatMap((task) => task.specializationTags)),
).sort();

type DifficultyFilter = 'All' | CorveeDifficulty;
type StatusFilter = 'All' | CorveeStatus;

export default function CorveePageClient() {
  const [difficulty, setDifficulty] = useState<DifficultyFilter>('All');
  const [status, setStatus] = useState<StatusFilter>('All');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const filteredTasks = useMemo(() => {
    return MOCK_CORVEE_TASKS.filter((task) => {
      if (difficulty !== 'All' && task.difficulty !== difficulty) {
        return false;
      }

      if (status !== 'All' && task.status !== status) {
        return false;
      }

      if (selectedTags.length > 0) {
        const hasSelectedTag = selectedTags.some((tag) => task.specializationTags.includes(tag));
        if (!hasSelectedTag) {
          return false;
        }
      }

      return true;
    });
  }, [difficulty, selectedTags, status]);

  const stats = useMemo(() => {
    return {
      totalOpenTasks: MOCK_CORVEE_TASKS.filter((task) => task.status === 'Open').length,
      yourCompletedTasks: 14,
      yourPendingReviews: MOCK_CORVEE_TASKS.filter((task) => task.status === 'Review').length,
    };
  }, []);

  function toggleTag(tag: string) {
    setSelectedTags((current) =>
      current.includes(tag) ? current.filter((item) => item !== tag) : [...current, tag],
    );
  }

  return (
    <>
      <SiteNav />

      <section className="hero corvee-hero">
        <div className="container corvee-hero-shell">
          <div className="section-label">{'// Corvée Board'}</div>
          <h1>Corvée Marketplace</h1>
          <p className="tagline">Claim work. Ship useful labor. Earn cSSS.</p>
          <p className="subtitle">
            Browse open tasks across review, documentation, testing, moderation, and onboarding. Filter for your lane, expand a card, and see what review looks like before you claim it.
          </p>
        </div>
      </section>

      <FadeIn className="corvee-section">
        <div className="container corvee-layout">
          <div className="corvee-main">
            <div className="section-label">{'// Marketplace Filters'}</div>
            <h2>Find the right <span className="red">task</span></h2>
            <p className="section-desc">
              The board is organized by difficulty, specialization, and workflow status so contributors can pick up work that matches their capacity.
            </p>

            <div className="corvee-filter-shell">
              <div className="corvee-filter-group">
                <span className="filter-label">Difficulty</span>
                <div className="filter-buttons">
                  {(['All', 'Easy', 'Medium', 'Hard'] as const).map((value) => (
                    <button
                      key={value}
                      type="button"
                      className={`filter-button${difficulty === value ? ' active' : ''}`}
                      onClick={() => setDifficulty(value)}
                    >
                      {value}
                    </button>
                  ))}
                </div>
              </div>

              <div className="corvee-filter-group">
                <span className="filter-label">Status</span>
                <div className="filter-buttons">
                  {(['All', 'Open', 'In Progress', 'Review'] as const).map((value) => (
                    <button
                      key={value}
                      type="button"
                      className={`filter-button${status === value ? ' active' : ''}`}
                      onClick={() => setStatus(value)}
                    >
                      {value}
                    </button>
                  ))}
                </div>
              </div>

              <div className="corvee-filter-group corvee-filter-group-tags">
                <span className="filter-label">Specialization</span>
                <div className="corvee-chip-grid">
                  {SPECIALIZATION_TAGS.map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      className={`capability-chip${selectedTags.includes(tag) ? ' capability-chip-active' : ' capability-chip-muted'}`}
                      onClick={() => toggleTag(tag)}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="results-count">{filteredTasks.length} tasks visible</div>

            <div className="corvee-task-list">
              {filteredTasks.map((task) => (
                <CorveeTaskCard key={task.id} task={task} />
              ))}
            </div>
          </div>

          <aside className="corvee-sidebar">
            <div className="corvee-sidebar-card">
              <div className="section-label">{'// Your Queue'}</div>
              <h3>Stats</h3>
              <div className="corvee-sidebar-stats">
                <div className="corvee-sidebar-stat">
                  <span>Total Open Tasks</span>
                  <strong>{stats.totalOpenTasks}</strong>
                </div>
                <div className="corvee-sidebar-stat">
                  <span>Your Completed Tasks</span>
                  <strong>{stats.yourCompletedTasks}</strong>
                </div>
                <div className="corvee-sidebar-stat">
                  <span>Your Pending Reviews</span>
                  <strong>{stats.yourPendingReviews}</strong>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </FadeIn>
    </>
  );
}
