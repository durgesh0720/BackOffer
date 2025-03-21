#!/bin/bash

pip install -r requirements.txt
python manage.py migrate
python manage.py collectstatic --noinput
python visualizer/load_data.py
