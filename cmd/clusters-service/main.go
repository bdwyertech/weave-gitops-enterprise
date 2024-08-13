package main

import (
	stdlog "log"
	"math/rand"
	"os"
	"time"

	"gopkg.in/DataDog/dd-trace-go.v1/ddtrace/tracer"
	"gopkg.in/DataDog/dd-trace-go.v1/profiler"

	"github.com/weaveworks/weave-gitops-enterprise/cmd/clusters-service/app"
	"github.com/weaveworks/weave-gitops-enterprise/pkg/version"
)

func main() {
	profiler.Start(
		profiler.WithService("gitops-ee"),
		profiler.WithVersion(version.Version),
		profiler.WithProfileTypes(
			profiler.CPUProfile,
			profiler.HeapProfile,
			// The profiles below are disabled by default to keep overhead
			// low, but can be enabled as needed.

			// profiler.BlockProfile,
			// profiler.MutexProfile,
			// profiler.GoroutineProfile,
		),
	)
	tracer.Start(
		tracer.WithRuntimeMetrics(),
		// tracer.WithEnv("prod"),
		tracer.WithService("gitops-ee"),
		// tracer.WithServiceVersion("abc123"),
	)
	rand.New(rand.NewSource(time.Now().UnixNano()))

	tempDir, err := os.MkdirTemp("", "*")
	if err != nil {
		stdlog.Fatalf("Failed to create a temp directory for Helm: %v", err)
	}
	defer func() {
		_ = os.RemoveAll(tempDir)
		profiler.Stop()
		tracer.Stop()
	}()

	command := app.NewAPIServerCommand()

	if err := command.Execute(); err != nil {
		os.Exit(1)
	}
}
