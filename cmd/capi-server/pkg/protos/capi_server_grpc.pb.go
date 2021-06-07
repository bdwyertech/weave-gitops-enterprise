// Code generated by protoc-gen-go-grpc. DO NOT EDIT.

package capi_server

import (
	context "context"
	grpc "google.golang.org/grpc"
	codes "google.golang.org/grpc/codes"
	status "google.golang.org/grpc/status"
)

// This is a compile-time assertion to ensure that this generated file
// is compatible with the grpc package it is being compiled against.
// Requires gRPC-Go v1.32.0 or later.
const _ = grpc.SupportPackageIsVersion7

// ClustersServiceClient is the client API for ClustersService service.
//
// For semantics around ctx use and closing/ending streaming RPCs, please refer to https://pkg.go.dev/google.golang.org/grpc/?tab=doc#ClientConn.NewStream.
type ClustersServiceClient interface {
	ListTemplates(ctx context.Context, in *ListTemplatesRequest, opts ...grpc.CallOption) (*ListTemplatesResponse, error)
	ListTemplateParams(ctx context.Context, in *ListTemplateParamsRequest, opts ...grpc.CallOption) (*ListTemplateParamsResponse, error)
	RenderTemplate(ctx context.Context, in *RenderTemplateRequest, opts ...grpc.CallOption) (*RenderTemplateResponse, error)
}

type clustersServiceClient struct {
	cc grpc.ClientConnInterface
}

func NewClustersServiceClient(cc grpc.ClientConnInterface) ClustersServiceClient {
	return &clustersServiceClient{cc}
}

func (c *clustersServiceClient) ListTemplates(ctx context.Context, in *ListTemplatesRequest, opts ...grpc.CallOption) (*ListTemplatesResponse, error) {
	out := new(ListTemplatesResponse)
	err := c.cc.Invoke(ctx, "/capi_server.v1.ClustersService/ListTemplates", in, out, opts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

func (c *clustersServiceClient) ListTemplateParams(ctx context.Context, in *ListTemplateParamsRequest, opts ...grpc.CallOption) (*ListTemplateParamsResponse, error) {
	out := new(ListTemplateParamsResponse)
	err := c.cc.Invoke(ctx, "/capi_server.v1.ClustersService/ListTemplateParams", in, out, opts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

func (c *clustersServiceClient) RenderTemplate(ctx context.Context, in *RenderTemplateRequest, opts ...grpc.CallOption) (*RenderTemplateResponse, error) {
	out := new(RenderTemplateResponse)
	err := c.cc.Invoke(ctx, "/capi_server.v1.ClustersService/RenderTemplate", in, out, opts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

// ClustersServiceServer is the server API for ClustersService service.
// All implementations must embed UnimplementedClustersServiceServer
// for forward compatibility
type ClustersServiceServer interface {
	ListTemplates(context.Context, *ListTemplatesRequest) (*ListTemplatesResponse, error)
	ListTemplateParams(context.Context, *ListTemplateParamsRequest) (*ListTemplateParamsResponse, error)
	RenderTemplate(context.Context, *RenderTemplateRequest) (*RenderTemplateResponse, error)
	mustEmbedUnimplementedClustersServiceServer()
}

// UnimplementedClustersServiceServer must be embedded to have forward compatible implementations.
type UnimplementedClustersServiceServer struct {
}

func (UnimplementedClustersServiceServer) ListTemplates(context.Context, *ListTemplatesRequest) (*ListTemplatesResponse, error) {
	return nil, status.Errorf(codes.Unimplemented, "method ListTemplates not implemented")
}
func (UnimplementedClustersServiceServer) ListTemplateParams(context.Context, *ListTemplateParamsRequest) (*ListTemplateParamsResponse, error) {
	return nil, status.Errorf(codes.Unimplemented, "method ListTemplateParams not implemented")
}
func (UnimplementedClustersServiceServer) RenderTemplate(context.Context, *RenderTemplateRequest) (*RenderTemplateResponse, error) {
	return nil, status.Errorf(codes.Unimplemented, "method RenderTemplate not implemented")
}
func (UnimplementedClustersServiceServer) mustEmbedUnimplementedClustersServiceServer() {}

// UnsafeClustersServiceServer may be embedded to opt out of forward compatibility for this service.
// Use of this interface is not recommended, as added methods to ClustersServiceServer will
// result in compilation errors.
type UnsafeClustersServiceServer interface {
	mustEmbedUnimplementedClustersServiceServer()
}

func RegisterClustersServiceServer(s grpc.ServiceRegistrar, srv ClustersServiceServer) {
	s.RegisterService(&ClustersService_ServiceDesc, srv)
}

func _ClustersService_ListTemplates_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(ListTemplatesRequest)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(ClustersServiceServer).ListTemplates(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: "/capi_server.v1.ClustersService/ListTemplates",
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(ClustersServiceServer).ListTemplates(ctx, req.(*ListTemplatesRequest))
	}
	return interceptor(ctx, in, info, handler)
}

func _ClustersService_ListTemplateParams_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(ListTemplateParamsRequest)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(ClustersServiceServer).ListTemplateParams(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: "/capi_server.v1.ClustersService/ListTemplateParams",
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(ClustersServiceServer).ListTemplateParams(ctx, req.(*ListTemplateParamsRequest))
	}
	return interceptor(ctx, in, info, handler)
}

func _ClustersService_RenderTemplate_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(RenderTemplateRequest)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(ClustersServiceServer).RenderTemplate(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: "/capi_server.v1.ClustersService/RenderTemplate",
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(ClustersServiceServer).RenderTemplate(ctx, req.(*RenderTemplateRequest))
	}
	return interceptor(ctx, in, info, handler)
}

// ClustersService_ServiceDesc is the grpc.ServiceDesc for ClustersService service.
// It's only intended for direct use with grpc.RegisterService,
// and not to be introspected or modified (even as a copy)
var ClustersService_ServiceDesc = grpc.ServiceDesc{
	ServiceName: "capi_server.v1.ClustersService",
	HandlerType: (*ClustersServiceServer)(nil),
	Methods: []grpc.MethodDesc{
		{
			MethodName: "ListTemplates",
			Handler:    _ClustersService_ListTemplates_Handler,
		},
		{
			MethodName: "ListTemplateParams",
			Handler:    _ClustersService_ListTemplateParams_Handler,
		},
		{
			MethodName: "RenderTemplate",
			Handler:    _ClustersService_RenderTemplate_Handler,
		},
	},
	Streams:  []grpc.StreamDesc{},
	Metadata: "capi_server.proto",
}
