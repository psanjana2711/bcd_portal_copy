ALTER TABLE doctor_assessments
  ADD COLUMN recommendation_followup TEXT NULL AFTER datapoint_feedback;

CREATE TABLE breast_assessment_findings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  assessment_id INT NOT NULL,
  side ENUM('right', 'left') NOT NULL,
  composition TEXT NULL,
  routine_views_uploaded BOOLEAN DEFAULT FALSE,
  has_masses BOOLEAN DEFAULT FALSE,
  mass_location TEXT NULL,
  mass_description TEXT NULL,
  has_calcification BOOLEAN DEFAULT FALSE,
  calcification_type ENUM('benign', 'malignant') NULL,
  skin_thickening BOOLEAN DEFAULT FALSE,
  nipple_retraction BOOLEAN DEFAULT FALSE,
  has_lymph_nodes BOOLEAN DEFAULT FALSE,
  lymph_node_type ENUM('benign', 'malignant') NULL,
  architectural_distortion BOOLEAN DEFAULT FALSE,
  focal_asymmetry BOOLEAN DEFAULT FALSE,
  asymmetry BOOLEAN DEFAULT FALSE,
  birads_category ENUM('1', '2', '3', '4', '4A', '4B', '4C', '5', '6') NULL,
  acr_density ENUM('A', 'B', 'C', 'D') NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_breast_findings_assessment
    FOREIGN KEY (assessment_id) REFERENCES doctor_assessments(id)
    ON DELETE CASCADE,
  UNIQUE KEY uq_breast_findings_assessment_side (assessment_id, side),
  INDEX ix_breast_findings_assessment_id (assessment_id),
  INDEX ix_breast_findings_side (side),
  INDEX ix_breast_findings_birads_category (birads_category),
  INDEX ix_breast_findings_acr_density (acr_density)
);
