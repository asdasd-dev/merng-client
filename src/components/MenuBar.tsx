import React, { useContext, useEffect, useState } from "react";
import { Menu, MenuItemProps } from "semantic-ui-react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/auth";

export const MenuBar: React.FC = () => {
    const context = useContext(AuthContext);

    const pathname = window.location.pathname;
    const path = pathname === "/" ? "home" : pathname.slice(1);

    const [activeItem, setActiveItem] = useState(path);
    useEffect(() => {
        setActiveItem(path);
    }, [path]);


    const handleItemClick = (e: React.MouseEvent, { name }: MenuItemProps) => {
        if (name === "logout") {
            context.logout();
            name = "home";
        }
        setActiveItem(name);
    };

    return (
        <Menu pointing secondary size="massive" color="teal">
            <Menu.Item
                name="home"
                active={activeItem === "home"}
                onClick={handleItemClick}
                as={Link}
                to="/"
            />
            <Menu.Menu position="right">
                {!context.user ? (
                    <React.Fragment>
                        <Menu.Item
                            name="login"
                            active={activeItem === "login"}
                            onClick={handleItemClick}
                            as={Link}
                            to="/login"
                        />
                        <Menu.Item
                            name="register"
                            active={activeItem === "register"}
                            onClick={handleItemClick}
                            as={Link}
                            to="/register"
                        />
                    </React.Fragment>
                ) : (
                    <Menu.Item
                        name="logout"
                        onClick={handleItemClick}
                        as={Link}
                        to="/"
                    />
                )}
            </Menu.Menu>
        </Menu>
    );
};
