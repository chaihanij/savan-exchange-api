#!/bin/bash
set -e

ECS_TASK_DEFINITION_PATH=ecs-task-definition.json

if [ ! -f "$ECS_TASK_DEFINITION_PATH" ]; then
  echo "ECS task definition file not found: $ECS_TASK_DEFINITION_PATH"
  exit 1
fi