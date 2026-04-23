import React from "react";

export default function Categories({ selectedCategories, onCategoryClick, categories }) {
    return (
        <div className="categories">
            <ul>
                {categories?.map((category, index) => (
                    <li
                        key={`${category}_${index}`}
                        className={selectedCategories.includes(category) ? "active" : ""}
                        onClick={() => onCategoryClick(category)}
                    >
                        {category}
                    </li>
                ))}
            </ul>
        </div>
    );
}