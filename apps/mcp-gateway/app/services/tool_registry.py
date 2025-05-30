"""
Tool registry for managing available MCP tools
"""

from typing import Dict, Any, List
import structlog

logger = structlog.get_logger()


class ToolRegistry:
    """Registry for managing MCP tools and servers"""
    
    def __init__(self):
        self.servers: Dict[str, Dict[str, Any]] = {}
        self.tools: Dict[str, Dict[str, Any]] = {}
    
    async def register_server(self, server_config: Dict[str, Any]):
        """Register an MCP server"""
        try:
            server_name = server_config["name"]
            self.servers[server_name] = server_config
            
            # Register tools from this server
            for tool_name in server_config.get("tools", []):
                self.tools[tool_name] = {
                    "name": tool_name,
                    "server": server_name,
                    "category": server_config.get("category", "general"),
                    "description": f"{tool_name} from {server_name} server",
                    "url": server_config.get("url", ""),
                    "status": "available"
                }
            
            logger.info(
                "MCP server registered",
                server=server_name,
                tools_count=len(server_config.get("tools", []))
            )
            
        except Exception as e:
            logger.error("Failed to register server", exc_info=e)
            raise
    
    async def get_all_tools(self) -> List[Dict[str, Any]]:
        """Get all registered tools"""
        return list(self.tools.values())
    
    async def get_tools_by_category(self, category: str) -> List[Dict[str, Any]]:
        """Get tools by category"""
        return [
            tool for tool in self.tools.values()
            if tool.get("category") == category
        ]
    
    async def get_tool_info(self, tool_name: str) -> Dict[str, Any]:
        """Get information about a specific tool"""
        return self.tools.get(tool_name, {})
    
    async def get_server_info(self, server_name: str) -> Dict[str, Any]:
        """Get information about a specific server"""
        return self.servers.get(server_name, {})
    
    async def update_tool_status(self, tool_name: str, status: str):
        """Update tool status"""
        if tool_name in self.tools:
            self.tools[tool_name]["status"] = status
            logger.info(
                "Tool status updated",
                tool=tool_name,
                status=status
            )
    
    async def get_server_health(self) -> Dict[str, Any]:
        """Get health status of all servers"""
        health_status = {}
        
        for server_name, server_config in self.servers.items():
            # In a real implementation, you would ping the server
            health_status[server_name] = {
                "status": "healthy",  # Mock status
                "url": server_config.get("url", ""),
                "tools_count": len(server_config.get("tools", [])),
                "last_check": "2024-01-15T10:30:00Z"
            }
        
        return health_status
