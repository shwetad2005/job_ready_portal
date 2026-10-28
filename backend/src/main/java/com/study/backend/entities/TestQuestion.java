package com.study.backend.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table (name = "test_questions")
public class TestQuestion {
	
	    @Id
	    @GeneratedValue(strategy =GenerationType.UUID)
	    private String id;

	    @ManyToOne(fetch = FetchType.LAZY)
//	    @JoinColumn(name = "test_id", nullable = false)
//	    @ToString.Exclude
//	    @EqualsAndHashCode.Exclude
	    private Test test;

	    @ManyToOne(fetch = FetchType.LAZY)
//	    @JoinColumn(name = "question_id", nullable = false)
//	    @ToString.Exclude
//	    @EqualsAndHashCode.Exclude
	    private Question question;

	    @Column(nullable = false)
	    private Integer questionOrder = 1;

	    @Column(nullable = false)
	    private Integer marks = 1;
	}

