package pl.mgr.vrp.benchmark

class CSVBuilder {

    File file = null

    static CSVBuilder newInstance(String timestamp, String postfix) {
        CSVBuilder builder = new CSVBuilder()
        builder.file = getFileFor(timestamp, postfix)
        return builder
    }

    static File getFileFor(String timestamp, String type) {
        new File("C:/tmp/results/result_${timestamp}_${type}.csv")
    }

    void buildLine(Collection items) {
        this.append(items)
        this.endl()
    }

    void append(Collection items) {
        StringBuilder stringBuilder = new StringBuilder()
        items.each { item ->
            stringBuilder.append(item.toString())
            stringBuilder.append(',')
        }
        file << stringBuilder.toString()
    }

    void endl() {
        file << '\n'
    }

    void writeResult(BenchmarkSuite.BenchmarkSuiteResult benchmarkSuiteResult) {
        file << benchmarkSuiteResult.toString() + "\n"
    }
}
