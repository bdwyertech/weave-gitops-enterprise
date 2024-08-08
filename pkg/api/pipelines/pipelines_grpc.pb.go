//
// This file holds the protobuf definitions for the Weave GitOps Pipelines API.
// Messages and enums are defined in types.proto.

// Code generated by protoc-gen-go-grpc. DO NOT EDIT.
// versions:
// - protoc-gen-go-grpc v1.5.1
// - protoc             (unknown)
// source: api/pipelines/pipelines.proto

package api

import (
	context "context"
	grpc "google.golang.org/grpc"
	codes "google.golang.org/grpc/codes"
	status "google.golang.org/grpc/status"
)

// This is a compile-time assertion to ensure that this generated file
// is compatible with the grpc package it is being compiled against.
// Requires gRPC-Go v1.64.0 or later.
const _ = grpc.SupportPackageIsVersion9

const (
	Pipelines_ListPipelines_FullMethodName    = "/pipelines.v1.Pipelines/ListPipelines"
	Pipelines_GetPipeline_FullMethodName      = "/pipelines.v1.Pipelines/GetPipeline"
	Pipelines_ApprovePromotion_FullMethodName = "/pipelines.v1.Pipelines/ApprovePromotion"
	Pipelines_ListPullRequests_FullMethodName = "/pipelines.v1.Pipelines/ListPullRequests"
)

// PipelinesClient is the client API for Pipelines service.
//
// For semantics around ctx use and closing/ending streaming RPCs, please refer to https://pkg.go.dev/google.golang.org/grpc/?tab=doc#ClientConn.NewStream.
//
// Weave GitOps Pipelines service definition
type PipelinesClient interface {
	// FIXME
	ListPipelines(ctx context.Context, in *ListPipelinesRequest, opts ...grpc.CallOption) (*ListPipelinesResponse, error)
	// FIXME
	GetPipeline(ctx context.Context, in *GetPipelineRequest, opts ...grpc.CallOption) (*GetPipelineResponse, error)
	// FIXME
	ApprovePromotion(ctx context.Context, in *ApprovePromotionRequest, opts ...grpc.CallOption) (*ApprovePromotionResponse, error)
	// FIXME
	ListPullRequests(ctx context.Context, in *ListPullRequestsRequest, opts ...grpc.CallOption) (*ListPullRequestsResponse, error)
}

type pipelinesClient struct {
	cc grpc.ClientConnInterface
}

func NewPipelinesClient(cc grpc.ClientConnInterface) PipelinesClient {
	return &pipelinesClient{cc}
}

func (c *pipelinesClient) ListPipelines(ctx context.Context, in *ListPipelinesRequest, opts ...grpc.CallOption) (*ListPipelinesResponse, error) {
	cOpts := append([]grpc.CallOption{grpc.StaticMethod()}, opts...)
	out := new(ListPipelinesResponse)
	err := c.cc.Invoke(ctx, Pipelines_ListPipelines_FullMethodName, in, out, cOpts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

func (c *pipelinesClient) GetPipeline(ctx context.Context, in *GetPipelineRequest, opts ...grpc.CallOption) (*GetPipelineResponse, error) {
	cOpts := append([]grpc.CallOption{grpc.StaticMethod()}, opts...)
	out := new(GetPipelineResponse)
	err := c.cc.Invoke(ctx, Pipelines_GetPipeline_FullMethodName, in, out, cOpts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

func (c *pipelinesClient) ApprovePromotion(ctx context.Context, in *ApprovePromotionRequest, opts ...grpc.CallOption) (*ApprovePromotionResponse, error) {
	cOpts := append([]grpc.CallOption{grpc.StaticMethod()}, opts...)
	out := new(ApprovePromotionResponse)
	err := c.cc.Invoke(ctx, Pipelines_ApprovePromotion_FullMethodName, in, out, cOpts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

func (c *pipelinesClient) ListPullRequests(ctx context.Context, in *ListPullRequestsRequest, opts ...grpc.CallOption) (*ListPullRequestsResponse, error) {
	cOpts := append([]grpc.CallOption{grpc.StaticMethod()}, opts...)
	out := new(ListPullRequestsResponse)
	err := c.cc.Invoke(ctx, Pipelines_ListPullRequests_FullMethodName, in, out, cOpts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

// PipelinesServer is the server API for Pipelines service.
// All implementations must embed UnimplementedPipelinesServer
// for forward compatibility.
//
// Weave GitOps Pipelines service definition
type PipelinesServer interface {
	// FIXME
	ListPipelines(context.Context, *ListPipelinesRequest) (*ListPipelinesResponse, error)
	// FIXME
	GetPipeline(context.Context, *GetPipelineRequest) (*GetPipelineResponse, error)
	// FIXME
	ApprovePromotion(context.Context, *ApprovePromotionRequest) (*ApprovePromotionResponse, error)
	// FIXME
	ListPullRequests(context.Context, *ListPullRequestsRequest) (*ListPullRequestsResponse, error)
	mustEmbedUnimplementedPipelinesServer()
}

// UnimplementedPipelinesServer must be embedded to have
// forward compatible implementations.
//
// NOTE: this should be embedded by value instead of pointer to avoid a nil
// pointer dereference when methods are called.
type UnimplementedPipelinesServer struct{}

func (UnimplementedPipelinesServer) ListPipelines(context.Context, *ListPipelinesRequest) (*ListPipelinesResponse, error) {
	return nil, status.Errorf(codes.Unimplemented, "method ListPipelines not implemented")
}
func (UnimplementedPipelinesServer) GetPipeline(context.Context, *GetPipelineRequest) (*GetPipelineResponse, error) {
	return nil, status.Errorf(codes.Unimplemented, "method GetPipeline not implemented")
}
func (UnimplementedPipelinesServer) ApprovePromotion(context.Context, *ApprovePromotionRequest) (*ApprovePromotionResponse, error) {
	return nil, status.Errorf(codes.Unimplemented, "method ApprovePromotion not implemented")
}
func (UnimplementedPipelinesServer) ListPullRequests(context.Context, *ListPullRequestsRequest) (*ListPullRequestsResponse, error) {
	return nil, status.Errorf(codes.Unimplemented, "method ListPullRequests not implemented")
}
func (UnimplementedPipelinesServer) mustEmbedUnimplementedPipelinesServer() {}
func (UnimplementedPipelinesServer) testEmbeddedByValue()                   {}

// UnsafePipelinesServer may be embedded to opt out of forward compatibility for this service.
// Use of this interface is not recommended, as added methods to PipelinesServer will
// result in compilation errors.
type UnsafePipelinesServer interface {
	mustEmbedUnimplementedPipelinesServer()
}

func RegisterPipelinesServer(s grpc.ServiceRegistrar, srv PipelinesServer) {
	// If the following call pancis, it indicates UnimplementedPipelinesServer was
	// embedded by pointer and is nil.  This will cause panics if an
	// unimplemented method is ever invoked, so we test this at initialization
	// time to prevent it from happening at runtime later due to I/O.
	if t, ok := srv.(interface{ testEmbeddedByValue() }); ok {
		t.testEmbeddedByValue()
	}
	s.RegisterService(&Pipelines_ServiceDesc, srv)
}

func _Pipelines_ListPipelines_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(ListPipelinesRequest)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(PipelinesServer).ListPipelines(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: Pipelines_ListPipelines_FullMethodName,
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(PipelinesServer).ListPipelines(ctx, req.(*ListPipelinesRequest))
	}
	return interceptor(ctx, in, info, handler)
}

func _Pipelines_GetPipeline_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(GetPipelineRequest)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(PipelinesServer).GetPipeline(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: Pipelines_GetPipeline_FullMethodName,
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(PipelinesServer).GetPipeline(ctx, req.(*GetPipelineRequest))
	}
	return interceptor(ctx, in, info, handler)
}

func _Pipelines_ApprovePromotion_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(ApprovePromotionRequest)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(PipelinesServer).ApprovePromotion(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: Pipelines_ApprovePromotion_FullMethodName,
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(PipelinesServer).ApprovePromotion(ctx, req.(*ApprovePromotionRequest))
	}
	return interceptor(ctx, in, info, handler)
}

func _Pipelines_ListPullRequests_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(ListPullRequestsRequest)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(PipelinesServer).ListPullRequests(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: Pipelines_ListPullRequests_FullMethodName,
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(PipelinesServer).ListPullRequests(ctx, req.(*ListPullRequestsRequest))
	}
	return interceptor(ctx, in, info, handler)
}

// Pipelines_ServiceDesc is the grpc.ServiceDesc for Pipelines service.
// It's only intended for direct use with grpc.RegisterService,
// and not to be introspected or modified (even as a copy)
var Pipelines_ServiceDesc = grpc.ServiceDesc{
	ServiceName: "pipelines.v1.Pipelines",
	HandlerType: (*PipelinesServer)(nil),
	Methods: []grpc.MethodDesc{
		{
			MethodName: "ListPipelines",
			Handler:    _Pipelines_ListPipelines_Handler,
		},
		{
			MethodName: "GetPipeline",
			Handler:    _Pipelines_GetPipeline_Handler,
		},
		{
			MethodName: "ApprovePromotion",
			Handler:    _Pipelines_ApprovePromotion_Handler,
		},
		{
			MethodName: "ListPullRequests",
			Handler:    _Pipelines_ListPullRequests_Handler,
		},
	},
	Streams:  []grpc.StreamDesc{},
	Metadata: "api/pipelines/pipelines.proto",
}
