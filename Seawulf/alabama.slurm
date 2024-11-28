#!/usr/bin/env bash

#SBATCH --nodes=1    
#SBATCH --time=48:00:00
#SBATCH --partition=large-28core
#SBATCH --job-name=panthers
#SBATCH --output=output_alabama.txt

module load anaconda/3
pip install --user pandas shapely geopandas gerrychain ipython tqdm
python /gpfs/home/tsinghal/Alabama/alabama.py
