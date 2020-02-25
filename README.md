# mx-beerhouse-fulfillments-monitor
Fulfillments monitor's scripts

This repo contains data analysis scripts to monitor the [fulfillments middleware](https://github.com/ZXVentures/mx-nextcloud-middleware).

It:

* scans Shopify's fulfillments on demand using the scripts in `/scanTable`;
* retrieves plotted and numeric aggregations about the fulfillments service:
  * count of unfulfilled orders in the last 30 days,
  * count of fulfilled orders in the last 30 days
    * by order created date
    * by order fulfillment date,
* creates a results file to deep dive in the data in `/scanTable/results`.

## Dependencies
This repo requires:

* [Node.js >= 12.0.0](https://nodejs.org/)
* [Python >= 3.6.0](https://www.python.org/downloads/)
* [Pandas >= 1.0.1](https://pandas.pydata.org/getting_started.html)
* [Jupyter Notebook](https://jupyter.org/install.html)

You can get both `Pandas` and `Jupyter` with `Conda`, with `pip`, or `pip3` if you have Python3 on Mac or Linux:

With [Conda](https://www.anaconda.com/download)
```
conda install -c conda-forge notebook
```

With pip
```
pip install --upgrade pip
pip install --upgrade pandas
pip install --upgrade jupyter matplotlib
pip install --upgrade jupyter notebook
```

With pip3 *recommended*
```
pip3 install --upgrade pip3
pip3 install --upgrade pandas
pip3 install --upgrade jupyter matplotlib
pip3 install --upgrade jupyter notebook
```

## How to run the scripts

### Configure your environment
In `/scanTable`, create and fill an `.env` file according to the `.env-default` sample.

In the same folder, open a terminal and run

```
npm install
```

### Run the notebooks
Open a terminal in the repo root folder and prompt

```
jupyter notebook
```

This will open a server in `localhost:8888`

Select the `notebooks` folder, and the `unfulfilled orders` notebook.

In the notebook toolbar, select `Kernel` and `Restart & Run all` to run all the scripts and see the aggregations.

You must close the server in your terminal by ending the process with `ctrl + c`.

### Known issues

Sometimes the plot cells do not display the plot. To fix it you must run again the script in the cell clicking in the `Run button`.

## Mantainers
* David Enríquez (david.enriquez@zx-ventures.mx)
