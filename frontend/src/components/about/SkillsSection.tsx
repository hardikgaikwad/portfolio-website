/* ═══════════════════════════════════════════════════════════
   SkillsSection — Technical Matrix & Security Arsenal
   ═══════════════════════════════════════════════════════════ */

import type { SkillCategory } from '../../types/api';

interface Props {
  skillCategories: SkillCategory[];
}

export default function SkillsSection({ skillCategories }: Props) {
  if (!skillCategories || skillCategories.length === 0) return null;

  return (
    <section className="skills-section" id="skills">
      <div className="section-container">
        {/* Section Header */}
        <div className="section-header">
          <div className="section-header__tag">INDEX REF: SEC-02 // TECHNICAL ARSENAL</div>
          <h2 className="section-title">ARSENAL & PROFICIENCIES</h2>
          <p className="section-subtitle">
            Categorized capabilities spanning penetration testing, defensive engineering, full-stack development, and infrastructure.
          </p>
        </div>

        {/* Skills Grid */}
        <div className="skills-grid">
          {skillCategories.map((category, idx) => (
            <div key={category.id} className="skill-category-card">
              <div className="skill-category-header">
                <div className="skill-category-title-group">
                  <span className="skill-category-index">CAT-{idx + 1 < 10 ? `0${idx + 1}` : idx + 1}</span>
                  <h3 className="skill-category-name">{category.name}</h3>
                </div>
                <span className="skill-category-count">{category.skills.length} TOOLS</span>
              </div>

              <div className="skill-category-items">
                {category.skills.map((skill) => (
                  <div key={skill.id} className="skill-tag">
                    <span className="skill-tag__prefix">›</span>
                    <span className="skill-tag__label">{skill.name}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
