#!/bin/bash

# Check if a feature name was provided
if [ -z "$1" ]; then
  echo "Usage: $0 <feature-name>"
  exit 1
fi

FEATURE_NAME=$1

# Convert feature name to CamelCase for class names (capitalize each segment and join)
FEATURE_NAME_CAMEL=$(echo "$FEATURE_NAME" | sed -E 's/(_|^)([a-z])/\U\2/g')

# Define the base directory relative to the script location (assumes script is run from project root)
BASE_DIR="./src/main/java/com/voter_analysis/voter_analysis"

# Verify the base directory exists; if not, print an error message
if [ ! -d "$BASE_DIR" ]; then
  echo "Error: The base directory '$BASE_DIR' does not exist. Please ensure you're running the script from the project root."
  exit 1
fi

# Create the main feature directory under the base directory, using the feature name without dots
FEATURE_BASE_DIR="$BASE_DIR/$FEATURE_NAME"

# Create subdirectories under the feature directory for each layer
mkdir -p "$FEATURE_BASE_DIR/controller"
mkdir -p "$FEATURE_BASE_DIR/service"
mkdir -p "$FEATURE_BASE_DIR/repository"
mkdir -p "$FEATURE_BASE_DIR/model"
mkdir -p "$FEATURE_BASE_DIR/dto"
mkdir -p "$FEATURE_BASE_DIR/mapper"

# Create sample Java files for each layer with correct package names
echo "package com.voter_analysis.voter_analysis.$FEATURE_NAME.controller;

import com.voter_analysis.voter_analysis.$FEATURE_NAME.service.${FEATURE_NAME_CAMEL}Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(\"/api/${FEATURE_NAME_CAMEL,,}\")
public class ${FEATURE_NAME_CAMEL}Controller {

    @Autowired
    private ${FEATURE_NAME_CAMEL}Service ${FEATURE_NAME_CAMEL,,}Service;

    // Define your endpoints here
}" > "$FEATURE_BASE_DIR/controller/${FEATURE_NAME_CAMEL}Controller.java"

echo "package com.voter_analysis.voter_analysis.$FEATURE_NAME.service;

import com.voter_analysis.voter_analysis.$FEATURE_NAME.model.${FEATURE_NAME_CAMEL};
import com.voter_analysis.voter_analysis.$FEATURE_NAME.repository.${FEATURE_NAME_CAMEL}Repository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ${FEATURE_NAME_CAMEL}Service {

    @Autowired
    private ${FEATURE_NAME_CAMEL}Repository ${FEATURE_NAME_CAMEL,,}Repository;

    // Define your business logic here
}" > "$FEATURE_BASE_DIR/service/${FEATURE_NAME_CAMEL}Service.java"

echo "package com.voter_analysis.voter_analysis.$FEATURE_NAME.repository;

import com.voter_analysis.voter_analysis.$FEATURE_NAME.model.${FEATURE_NAME_CAMEL};
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ${FEATURE_NAME_CAMEL}Repository extends MongoRepository<${FEATURE_NAME_CAMEL}, String> {
    // Define your custom queries here
}" > "$FEATURE_BASE_DIR/repository/${FEATURE_NAME_CAMEL}Repository.java"

echo "package com.voter_analysis.voter_analysis.$FEATURE_NAME.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = \"${FEATURE_NAME_CAMEL,,}\")
public class ${FEATURE_NAME_CAMEL} {

    @Id
    private String id;

    // Add your fields here

    // Constructors, getters, and setters
}" > "$FEATURE_BASE_DIR/model/${FEATURE_NAME_CAMEL}.java"

echo "package com.voter_analysis.voter_analysis.$FEATURE_NAME.dto;

public class ${FEATURE_NAME_CAMEL}DTO {

    // Define your DTO fields here

    // Constructors, getters, and setters
}" > "$FEATURE_BASE_DIR/dto/${FEATURE_NAME_CAMEL}DTO.java"

echo "package com.voter_analysis.voter_analysis.$FEATURE_NAME.mapper;

import com.voter_analysis.voter_analysis.$FEATURE_NAME.dto.${FEATURE_NAME_CAMEL}DTO;
import com.voter_analysis.voter_analysis.$FEATURE_NAME.model.${FEATURE_NAME_CAMEL};
import org.mapstruct.Mapper;

@Mapper(componentModel = \"spring\")
public interface ${FEATURE_NAME_CAMEL}Mapper {

    ${FEATURE_NAME_CAMEL}DTO toDTO(${FEATURE_NAME_CAMEL} ${FEATURE_NAME_CAMEL,,});
    ${FEATURE_NAME_CAMEL} toEntity(${FEATURE_NAME_CAMEL}DTO ${FEATURE_NAME_CAMEL,,}DTO);

}" > "$FEATURE_BASE_DIR/mapper/${FEATURE_NAME_CAMEL}Mapper.java"

echo "Feature '$FEATURE_NAME_CAMEL' structure created successfully under the directory '$FEATURE_BASE_DIR' with compliant package names!"
