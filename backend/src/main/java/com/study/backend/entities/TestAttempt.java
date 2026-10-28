package com.study.backend.entities;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.OneToMany;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.ToString;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class TestAttempt {

	@Id
	@GeneratedValue(strategy = GenerationType.UUID)
	private String id;
	
	@Column(nullable = false)
	private Integer score = 0;

	@Column
	private Integer totalMarks = 0;

	@Column
	private Integer timeTakenSeconds = 0;

	@ManyToOne
	private User user;
	
	@ManyToOne
	private Test test;

	@ToString.Exclude
	@EqualsAndHashCode.Exclude
	@OneToMany(mappedBy = "testAttempt", cascade = jakarta.persistence.CascadeType.ALL, orphanRemoval = true)
	private List<StudentAnswer> answers = new ArrayList<>();
	
	private LocalDateTime attemptedAt; 
	 @PrePersist
	    public void onCreate() {
	        attemptedAt = LocalDateTime.now();
	    }
}
